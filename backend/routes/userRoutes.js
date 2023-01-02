const express = require("express");
const { registerUser } = require("../controllers/userControllers");

const router = express.Router();

router.route("/signup").post(registerUser);

// router.route("/login").post(loginUser);

module.exports = router;
