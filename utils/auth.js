const { verifyToken } = require("./tokenOperations");
const { AuthenticationError } = require("apollo-server");

function checkJWT(context) {
    const token = context.req.headers.authorization;
    if (!token && !verifyToken(token)) {
        throw new AuthenticationError("Invalid, expired or missing token");
    }
}

module.exports = { checkJWT };
