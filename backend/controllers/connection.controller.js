import ConnectionRequest from "../models/connectionRequest.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.user._id;
    if (senderId.toString() === userId) {
      return res
        .status(301)
        .json({ message: "You can't send connection request to yourself" });
    }
    if (req.user.connections.includes(userId)) {
      return res.status(301).json({ message: "User already in connections" });
    }
    const existingRequest = await ConnectionRequest.findOne({
      sender: senderId,
      recipient: userId,
      status: "pending",
    });
    if (existingRequest) {
      return res
        .status(301)
        .json({ message: "Connection Requestion already sent" });
    }
    const newConnection = new ConnectionRequest({
      sender: senderId,
      recipient: userId,
      status: "pending",
    });
    await newConnection.save();

    return res
      .status(200)
      .json({ message: "Connection request sent successfully" });
  } catch (error) {
    console.log("error in sendConnectionRequest ", error);
    return res.status(500).json({ message: "server error" });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;
    const request = await ConnectionRequest.findById(requestId)
      .populate("sender", "name email username")
      .populate("recipient", "name username");
    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }
    // check if the requst is for current user.?
    if (request.recipient._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to accept this request" });
    }
    if (request.status !== "pending") {
      return res.status(403).json({ message: "Request procesed successfully" });
    }
    request.status = "accepted";
    await request.save();
    // if i'm your friend , means you are also my frnd [updated connection from both sides]
    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: request.sender._id },
    });
    await User.findByIdAndUpdate(request.sender._id, {
      $addToSet: { connections: userId },
    });

    const newNotification = new Notification({
      recipient: request.sender._id,
      relatedUser: userId,
      type: "connectionAccepted",
    });

    await newNotification.save();
    res.status(200).json({ message: "Connection accepted successfully" });

    // send email
    const senderEmail = request.sender.email;
    const senderName = request.sender.name;
    const recipientName = request.recipient.name;
    const profileUrl = process.env.CLIENT_URL + "/profile/" + request.recipient;
    try {
      // send email( about connection request)
      await sendConnectionAcceptEmail(
        senderEmail,
        senderName,
        recipientName,
        profileUrl
      );
    } catch (error) {
      console.log("error in connection controller send email: ", error);
    }
  } catch (error) {
    console.log("error in sendConnectionRequest ", error);
    return res.status(500).json({ message: "server error" });
  }
};

export const rejectConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;
    const request = await ConnectionRequest.findById(requestId);
    if (request.recipient.toString() !== userId.toString()) {
      return res
        .status(400)
        .json({ message: "Not authorized to reject this request" });
    }
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been processed" });
    }
    request.status = "rejected";
    await request.save();
    res.json({ message: "connection request rejected" });
  } catch (error) {
    console.log("error in ", rejectConnectionRequest);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await ConnectionRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "name username profilePicture headline connections");
    return res.json(requests);
  } catch (error) {
    console.log("error in getConnectionRequests: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getUserConnections = async (req, res) => {
  try {
    const userId = req.user._id;
    const connections = await User.findById(userId).populate(
      "connections",
      "name username profilePicture headline connections"
    );
    return res.status(200).json(connections);
  } catch (error) {
    console.log("error in getUserConnections ", error);
    return res.status(500).json({ message: "server error" });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const myId = req.user._id;
    const { userId } = req.params;

    await User.findByIdAndUpdate(myId, {
      $pull: { connections: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { connections: myId },
    });
  } catch (error) {
    console.log("error in removeConnection ", error);
    return res.status(500).json({ message: "server error" });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;
    const currentUser = req.user;
    if (currentUser.connections.includes(targetUserId)) {
      return res.status(200).json({ status: "connected" });
    }
    // check pending request
    const pendingRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: targetUserId, recipient: currentUserId },
        { sender: currentUserId, recipient: targetUserId },
      ],
      status: "pending",
    });

    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currentUserId.toString()) {
        return res.json({ status: "pending" });
      } else {
        return res.json({ status: "recevied", requestId: pendingRequest._id });
      }
    }
    return res.status(200).json({ status: "not_connected" });
  } catch (error) {
    console.log("error in getConnectionStatus ", error);
    return res.status(500).json({ message: "server error" });
  }
};
