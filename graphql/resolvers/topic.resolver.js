const { User } = require("../../models/user.model");
const { Post } = require("../../models/post.model");
const { checkJWT } = require("../../utils/auth");

const notificationResolvers = {
    Query: {},
    Mutation: {},
    Topic: {
        async posts(parent) {
            const post = await User.findOne({ _id: parent._id });
            await post.populate("posts");
            return post.posts;
        },
    },
};

module.exports = { notificationResolvers };
