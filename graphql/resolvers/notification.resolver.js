const { User } = require("../../models/user.model");
const { Post } = require("../../models/post.model");
const { checkJWT } = require("../../utils/auth");

const notificationResolvers = {
    Query: {},
    Mutation: {},
    Notification: {
        async user(parent) {
            await parent.populate("user");
            return parent.user;
        },
    },
};

module.exports = { notificationResolvers };
