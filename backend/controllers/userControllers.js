const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");

const bcrypt = require("bcrypt");
const saltRounds = 10;

function registerUser(req, res) {
    const { name, email, password, profilePicture } = req.body;

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
                newUser = new User({
                    name: name,
                    email: email,
                    password: passwordHash,
                    picture: profilePicture,
                });
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
                    res.status;
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

module.exports = { registerUser, loginUser };
