const Chat = require("../Models/chatModel");

function accessChat(req, res) {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    Chat.find({
        $and: [
            {
                isGroupChat: false,
            },
            {
                users: {
                    $elemMatch: {
                        $eq: req.user._id,
                    },
                },
            },
            {
                users: {
                    $elemMatch: {
                        $eq: userId,
                    },
                },
            },
        ],
    })
        .populate([
            { path: "users", select: "-password" },
            {
                path: "latestMessage",
                populate: {
                    path: "sender",
                    select: "name pic email",
                },
            },
        ])
        .exec((err, foundChats) => {
            if (foundChats.length > 0) {
                res.send(foundChats[0]);
            } else {
                console.log("1");
                const chatData = new Chat({
                    chatName: "sender",
                    isGroupChat: false,
                    users: [req.user._id, userId],
                });

                chatData.save((error, savedChat) => {
                    console.log("2");
                    if (error) {
                        console.log(error);
                    } else {
                        savedChat.populate("users", "-password").then(() => {
                            console.log("3");
                            res.status(200).send(savedChat);
                        });
                    }
                });
            }
        });
}

function fetchChats(req, res) {
    console.log(req.user.id);
    Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
        .populate([
            { path: "users", select: "-password" },
            { path: "groupAdmin", select: "-password" },
            {
                path: "latestMessage",
                populate: {
                    path: "sender",
                    select: "name pic email",
                },
            },
        ])
        .sort({ updatedAt: -1 })
        .exec((err, foundChats) => {
            console.log(foundChats);
            res.send(foundChats);
        });
}

function createGroupChat(req, res) {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields!" });
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    const newGroup = new Chat({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
    });

    newGroup.save((err, savedGroup) => {
        if (err) {
            console.log(err);
        } else {
            savedGroup
                .populate([
                    { path: "users", select: "-password" },
                    { path: "groupAdmin", select: "-password" },
                ])
                .then(() => {
                    res.status(200).json(savedGroup);
                });
        }
    });
}

function renameGroup(req, res) {
    const { chatId, chatName } = req.body;

    Chat.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true })
        .populate([
            { path: "users", select: "-password" },
            { path: "groupAdmin", select: "-password" },
        ])
        .exec((err, updatedGroup) => {
            if (!updatedGroup) {
                res.status(404);
                throw new Error("Chat not found");
            } else {
                res.json(updatedGroup);
            }
        });
}

function addToGroup(req, res) {
    const { chatId, userId } = req.body;

    Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
        .populate([
            { path: "users", select: "-password" },
            { path: "groupAdmin", select: "-password" },
        ])
        .exec((err, updatedGroup) => {
            if (!updatedGroup) {
                res.status(404);
                throw new Error("Chat not found");
            } else {
                res.json(updatedGroup);
            }
        });
}

function removeFromGroup(req, res) {
    const { chatId, userId } = req.body;

    Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
        .populate([
            { path: "users", select: "-password" },
            { path: "groupAdmin", select: "-password" },
        ])
        .exec((err, updatedGroup) => {
            if (!updatedGroup) {
                res.status(404);
                throw new Error("Chat not found");
            } else {
                res.json(updatedGroup);
            }
        });
}

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
};
