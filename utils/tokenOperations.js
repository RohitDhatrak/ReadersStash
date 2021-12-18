const jwt = require("jsonwebtoken");

function signToken(userId) {
    return jwt.sign({ userId }, process.env.SECRET, { expiresIn: "7d" });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.SECRET);
    } catch (e) {
        return false;
    }
}

module.exports = { signToken, verifyToken };
