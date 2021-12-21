const { User } = require("../../models/user.model");
const { Comment } = require("../../models/comment.model");
const { checkJWT } = require("../../utils/auth");

const commentResolvers = {
    Query: {},
    Mutation: {},
    Comment: {
        async user(parent) {
            await parent.populate("user");
            return parent.user;
        },
        async likes(parent) {
            await parent.populate("likes");
            return parent.likes;
        },
        async replies(parent) {
            await parent.populate("replies");
            return parent.replies;
        },
        async parent(parent) {
            await parent.populate("parent");
            return parent.parent;
        },
    },
};

module.exports = { commentResolvers };
