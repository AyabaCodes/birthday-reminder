const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  birthMonth: { type: Number, required: true, min: 1, max: 12 },
  birthDay: { type: Number, required: true, min: 1, max: 31 },
  lastEmailSent: Date,
  emailStatus: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending",
  },
});

module.exports = mongoose.model("User", userSchema);
