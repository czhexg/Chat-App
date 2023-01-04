const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, accessChat).post(protect, fetchChats);

router.route("/group").post(protect, createGroupChat);

router.route("/rename").put(protect, renameGroup);

router.route("/groupremove").put(protect, removeFromGroup);

router.route("/groupadd").put(protect, addToGroup);

module.exports = router;
