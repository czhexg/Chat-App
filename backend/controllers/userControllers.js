const User = require("../Models/userModel");

function registerUser(req, res, next) {
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
            newUser = new User({
                name: name,
                email: email,
                password: password,
                picture: profilePicture,
            });
            newUser.save((err, savedUser) => {
                if (err) {
                    res.status(400);
                    throw new Error("Failed to create user");
                } else {
                    res.status.json({
                        _id: savedUser.id,
                        name: savedUser.name,
                        email: savedUser.email,
                        profilePicture: savedUser.picture,
                    });
                }
                res.status;
            });
        }
    });
}

module.exports = { registerUser };
