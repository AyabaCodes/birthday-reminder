const express = require("express");
const UserController = require("./controllers/UserController");
const HomeController = require("./controllers/HomeController");

const router = express.Router();

router.get("/", HomeController.index);
router.post("/add-user", UserController.createUser);

module.exports = router;
