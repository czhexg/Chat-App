const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");

const bcrypt = require("bcrypt");
const saltRounds = 10;

function registerUser(req, res) {
    const { name, email, password, picture } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all the fields!");
    }

    User.findOne({ email }, (err, foundUser) => {
        if (foundUser) {
            res.status(400);
            throw new Error("User already exists!");
        } else {
            bcrypt.hash(password, saltRounds, function (err, passwordHash) {
                if (picture) {
                    newUser = new User({
                        name: name,
                        email: email,
                        password: passwordHash,
                        picture: picture,
                    });
                } else {
                    newUser = new User({
                        name: name,
                        email: email,
                        password: passwordHash,
                    });
                }
                newUser.save((err, savedUser) => {
                    if (err) {
                        res.status(400);
                        console.log(err);
                        throw new Error("Failed to create user");
                    } else {
                        res.status(200).json({
                            _id: savedUser.id,
                            name: savedUser.name,
                            email: savedUser.email,
                            profilePicture: savedUser.picture,
                            token: generateToken(savedUser._id),
                        });
                    }
                    res.status(200);
                });
            });
        }
    });
}

function loginUser(req, res) {
    const { email, password } = req.body;

    User.findOne({ email }, (err, foundUser) => {
        if (foundUser) {
            bcrypt.compare(
                password,
                foundUser.password,
                function (err, result) {
                    if (result == true) {
                        res.json({
                            _id: foundUser.id,
                            name: foundUser.name,
                            email: foundUser.email,
                            profilePicture: foundUser.picture,
                            token: generateToken(foundUser._id),
                        });
                    } else {
                        res.status(401);
                        throw new Error("Invalid Email or Password");
                    }
                }
            );
        } else {
            res.status(401);
            throw new Error("Invalid Email or Password");
        }
    });
}

function findUsers(req, res) {
    const keyword = req.query.search;

    if (keyword) {
        User.find(
            {
                $and: [
                    {
                        $or: [
                            { name: { $regex: keyword, $options: "i" } },
                            { email: { $regex: keyword, $options: "i" } },
                        ],
                    },
                    {
                        _id: { 
                            $ne: req.user._id 
                        },
                    },
                ],
            },
            (err, foundUsers) => {
                res.send(foundUsers);
            }
        );
    }
}

module.exports = { registerUser, loginUser, findUsers };
