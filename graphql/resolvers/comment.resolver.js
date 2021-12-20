const { User } = require("../../models/user.model");
const { Comment } = require("../../models/comment.model");
const { checkJWT } = require("../../utils/auth");

const commentResolvers = {
    Query: {},
    Mutation: {},
    Comment: {
        async user(parent) {
            const user = await User.findOne({ _id: parent.user });
            return user;
        },
        async likes(parent) {
            const comment = await Comment.findOne({ _id: parent._id });
            if (comment) {
                await comment.populate("likes");
                return comment.likes;
            } else {
                return [];
            }
        },
        async replies(parent) {
            const comment = await Comment.findOne({ _id: parent._id });
            if (comment) {
                await comment.populate("replies");
                return comment.replies;
            } else {
                return [];
            }
        },
    },
};

module.exports = { commentResolvers };
