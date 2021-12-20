const { User } = require("../../models/user.model");
const { Post } = require("../../models/post.model");
const { checkJWT } = require("../../utils/auth");

const notificationResolvers = {
    Query: {},
    Mutation: {},
    Notification: {
        async user(parent) {
            const user = await User.findOne({ _id: parent.user });
            return user;
        },
    },
};

module.exports = { notificationResolvers };
