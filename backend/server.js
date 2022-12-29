require("dotenv").config();
const express = require("express");

const chats = require("./data");

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("api test");
});
app.get("/api/chats", (req, res) => {
    res.send(chats);
});
app.get("/api/chats/:id", (req, res) => {
    res.send(req.params.id);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    console.log("listening for requests");
});
