require("dotenv").config();
const cors = require("cors");
const express = require("express");
const path = require("path");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/build/index.html"),
        (err) => {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});

connectDB().then(() => {
    const server = app.listen(port, () => {
        console.log(`Server started on port ${port}`);
        console.log("listening for requests");
    });

    const io = require("socket.io")(server, {
        pingTimeout: 30000,
        cors: {
            origin: "http://localhost:3000",
        },
    });

    io.on("connection", (socket) => {
        console.log("Connected to socket.io");

        socket.on("setup", (userData) => {
            socket.join(userData._id);
            socket.emit("connected");
        });

        socket.on("join chat", (room) => {
            socket.join(room);
            console.log("User joined room: " + room);
        });

        socket.on("typing", (room) => socket.in(room).emit("typing"));
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

        socket.on("new message", (newMessageReceived) => {
            console.log("new message");
            let chat = newMessageReceived.chat;

            if (!chat.users) {
                console.log("chat.users not defined");
                return;
            }

            for (let user of chat.users) {
                if (user._id == newMessageReceived.sender._id) {
                    continue;
                } else {
                    socket
                        .in(user._id)
                        .emit("message received", newMessageReceived);
                }
            }
        });
    });
});
