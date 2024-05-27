const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const brcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const registerCtrl = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  if (!firstName || !lastName || !email || !phone || !password) {
    res.status(400);
    json({
      success: false,
      message: "All fields are required",
    });
  }
  const userFound = await User.findOne({ email });
  if (userFound) {
    res.status(400).json({ success: false, message: "User alrrady exists" });
  }

  const hashedPassword = await brcypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
  });
  await newUser.save();
  res.redirect('/api/v1/users/login')
  res.status(200).json({
    success: true,
    message: "User registerd successfully",
  });
});

const loginCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  const userFound = await User.findOne({ email });
  if (!userFound) {
    res.status.json({
      success: false,
      message: "User not found",
    });
  }
  const isPasswordMatched = await brcypt.compare(password, userFound?.password);
  if (!isPasswordMatched) {
    res.status(404).json({
      success: false,
      message: "Invalid login credentials",
    });
  }

  const token = jwt.sign({ id: userFound?._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  console.log(token);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.redirect("/api/v1/users/profile");
  res.status(200).json({
    success: true,
    id: userFound?._id,
    message: "user logged in successfully",
    userFound,
  });
});

const logoutCtrl = asyncHandler(async (req, res) => {
  res.clearCookie("token"); // Clear the token cookie
  // Redirect to the login page after logout
  res.redirect("/");
});

const userProfile = asyncHandler(async (req, res) => {
  // console.log(req.user.id);
  const userFound = await User.findById(req?.user?.id).populate("house");
  const isLoggedIn = req.cookies.token;
  if (userFound) {
    res.render('profile',{ userFound, isLoggedIn });
  }
});



module.exports = {
  registerCtrl,
  loginCtrl,
  logoutCtrl,
  userProfile,
};
