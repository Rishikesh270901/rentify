const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  house: [{ type: mongoose.Schema.Types.ObjectId, ref: "House" }], // Correct reference to "House"
});

const User = mongoose.model("User", userSchema);

module.exports = User;
