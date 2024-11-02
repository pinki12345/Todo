const User = require("../models/user");
const Board = require("../models/board");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
var bcrypt = require("bcryptjs");
dotenv.config();

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    console.log(name, email, password, confirmPassword);
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }
    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    
    const newBoard = new Board({
      users: newUser._id,
    });
    await newBoard.save();


    res.status(201).json({
      success: true,
      data: newUser,
      message: "Account created successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "Wrong email or password" });
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res.status(400).json({ message: "Wrong email or password" });
    }
    const boards = await Board.find({ users: user._id })
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
    res.setHeader("Authorization", `Bearer ${token}`);
    return res.json({ message: "Logged in successfully", token, user });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsersExceptCurrent = async (req, res) => {
  const userId = req.user._id;
  try {
    const users = await User.find({ _id: { $ne: userId } }).exec();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve users.",
    });
  }
};

exports.updateUser = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const { name, email, oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Old password is incorrect." });
      }
    } else {
      return res.status(400).json({ success: false, message: "Old password is required." });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
