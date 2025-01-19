import Notification from "../models/notification.model.js";

export const getUserNotifications = async (req, res) => {
  try {
    const notification = await Notification.find({
      recipient: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("relatedUser", "name username profilePicture")
      .populate("relatedPost", "content image");
    return res.status(200).json(notification);
  } catch (error) {
    console.log("error in getUserNotifications ", error);
    return res.status(500).json({ message: "server error" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findByIdAndUpdate(
      {
        _id: notificationId,
        recipient: req.user._id,
      },
      {
        read: true,
      },
      { new: true }
    );
    return res.status(200).json(notification);
  } catch (error) {
    console.log("Error in markNotificationAsRead ", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    await Notification.findByIdAndDelete({
      _id: notificationId,
      recipient: req.user._id,
    });
    return res
      .status(200)
      .json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("error in deleteNotification: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};
