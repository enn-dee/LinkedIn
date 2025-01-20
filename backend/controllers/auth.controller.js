import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRECT, {
      expiresIn: "3d",
    });
    res.cookie("jwt-linkedin", token, {
      httpOnly: true, // prevent Xss attacks
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict", // prevent CSRF aatacks
      secure: process.env.NODE_ENV === "production", // prevents Man-in-the-middle attacks
    });
    res.status(201).json({ message: "User registered successfully" });

    // send welcome email
    const profileUrl = process.env.CLIENT_URL + "/profile" + user.username;
    try {
      await sendWelcomeEmail(user.email, user.name, profileUrl);
    } catch (error) {
      console.log("Error sending welcome email: ", error);
      //   res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(`Error in signup: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRECT, {
      expiresIn: "3d",
    });
    await res.cookie("jwt-linkedin", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    console.log("error in login controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt-linkedin");
  res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("Error in getUser controller: ", error);
    res.status(500).json({ message: "server error" });
  }
};
