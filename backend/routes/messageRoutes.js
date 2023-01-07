const express = require("express");
const {
    sendMessage,
    getChatMessages,
} = require("../controllers/messageControllers");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/send").post(protect, sendMessage);

router.route("/:chatId").get(protect, getChatMessages);

module.exports = router;
