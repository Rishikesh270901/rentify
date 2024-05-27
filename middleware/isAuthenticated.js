const asynchandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const isAuthenticated = asynchandler(async (req, res, next) => {
  if (req.cookies.token) {
    const decode = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decode?.id).select("-password");
    return next();
  } else {
    res.status(401).json({
      message: "user not authenticated",
    });
  }
});

module.exports = isAuthenticated;
