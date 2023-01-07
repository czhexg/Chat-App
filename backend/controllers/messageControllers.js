const Chat = require("../Models/chatModel");
const Message = require("../Models/messageModel");

function sendMessage(req, res) {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("invalid data passed into request");
        return res.sendStatus(400);
    }

    let newMessage = new Message({
        sender: req.user._id,
        content: content,
        chat: chatId,
    });

    newMessage.save((err, savedMessage) => {
        if (err) {
            console.log(err);
        }
        savedMessage
            .populate([
                { path: "sender", select: "name picture email" },
                {
                    path: "chat",
                    populate: {
                        path: "users",
                        select: "name picture email",
                    },
                },
            ])
            .then(() => {
                Chat.findByIdAndUpdate(
                    req.body.chatId,
                    {
                        latestMessage: savedMessage,
                    },
                    (error) => {
                        if (error) {
                            console.log(error);
                        } else {
                            res.json(savedMessage);
                        }
                    }
                );
            });
    });
}

function getChatMessages(req, res) {
    Message.find({
        chat: req.params.chatId,
    })
        .populate([
            { path: "sender", select: "name picture email" },
            {
                path: "chat",
                populate: {
                    path: "users",
                    select: "name picture email",
                },
            },
        ])
        .exec((err, foundMessages) => {
            if (err) {
                console.log(err);
                res.status(400);
            } else {
                res.json(foundMessages);
            }
        });
}

module.exports = { sendMessage, getChatMessages };
