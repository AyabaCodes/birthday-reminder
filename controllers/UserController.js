const User = require("../models/User");
const config = require("../config");

class UserController {
  static async createUser(req, res) {
    try {
      const { username, email, dob } = req.body;
      const [year, month, day] = dob.split("-");

      const user = new User({
        username,
        email,
        birthMonth: parseInt(month, 10),
        birthDay: parseInt(day, 10),
      });

      await user.save();
      const users = await User.find();

      res.render("success", {
        message: "Birthday added successfully!",
        users,
      });
    } catch (error) {
      res.render("error", {
        errorMessage: error.message,
        redirectUrl: "/",
      });
    }
  }
}

module.exports = UserController;
