require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

function protect(req, res, next) {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            User.findById(decoded.id, "-password", (err, foundUser) => {
                req.user = foundUser;
                next();
            });
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    } else {
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
}

module.exports = protect;
