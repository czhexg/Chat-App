require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const chats = require("./data");

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
    res.send("api test");
});
app.get("/api/chats", (req, res) => {
    console.log("chats api");
    res.send(chats);
});
app.get("/api/chats/:id", (req, res) => {
    res.send(req.params.id);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    console.log("listening for requests");
});
