import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Nodemailer Config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Send Email with Password Setup Link
export const sendEmail = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
      await user.save();
    }

    // Generate JWT Token (valid for 1 hour)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const link = `${process.env.FRONTEND_URL}/set-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER, //  Fix Here
      to: email,
      subject: "Set Your Password",
      html: `<p>Click <a href="${link}">here</a> to set your password. This link expires in 1 hour.</p>`,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email", error });
  }
};

// Set Password After Email Verification
export const setPassword = async (req, res) => {
  const { token, password, name } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { password: hashedPassword, name: name },
      { new: true }
    );

    if (!user) return res.status(400).json({ message: "Invalid token" });

    res.status(200).json({ message: "Password set successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please request a new email." });
    }
    res.status(500).json({ message: "Invalid or expired token", error });
  }
};

// User Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT for Authentication (Valid for 7 days)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send login success email
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Fix Here
      to: email,
      subject: "Login Successful",
      html: `<p>You have successfully logged in.</p>`,
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login error", error });
  }
};
