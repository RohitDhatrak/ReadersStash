const { User } = require("../../models/user.model");
const { Post } = require("../../models/post.model");
const { checkJWT } = require("../../utils/auth");

const commentResolvers = {
    Query: {},
    Mutation: {},
    Comment: {},
};

module.exports = { commentResolvers };
