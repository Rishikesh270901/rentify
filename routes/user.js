const express = require("express");
const {
  registerCtrl,
  loginCtrl,
  logoutCtrl,
  userProfile,
} = require("../controllers/user");
const isAuthenticated = require("../middleware/isAuthenticated");
const { houseUpdate } = require("../controllers/house");
const userRouter = express.Router();
userRouter.post("/register", registerCtrl);
userRouter.post("/login", loginCtrl);
userRouter.get("/logout", logoutCtrl);
userRouter.get("/profile", isAuthenticated, userProfile);
userRouter.put("/update-house", houseUpdate);

userRouter.get("/login", async (req, res) => {
  res.render("login");
});
userRouter.get('/register', async (req, res) => {
  res.render("register");
})
module.exports = userRouter;
