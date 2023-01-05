const express = require("express");
const {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
} = require("../controllers/chatControllers");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, fetchChats).post(protect, accessChat);

router.route("/group").post(protect, createGroupChat);

router.route("/rename").patch(protect, renameGroup);

router.route("/groupadd").patch(protect, addToGroup);

router.route("/groupremove").patch(protect, removeFromGroup);

module.exports = router;
