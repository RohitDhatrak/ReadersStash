const { User } = require("../../models/user.model");
const { Comment } = require("../../models/comment.model");
const { checkJWT } = require("../../utils/auth");

const commentResolvers = {
    Query: {
        async getComments(parent, args, context) {
            checkJWT(context);
            const comments = await Comment.find();
            return comments;
        },
    },
    Mutation: {
        async addComment(parent, args, context) {
            checkJWT(context);
            const { body, userId, parentCommentId } = args;
            if (parentCommentId) {
                const comment = new Comment({
                    body,
                    user: userId,
                    parentComment: parentCommentId,
                });
                return comment;
            } else {
                const comment = new Comment({
                    body,
                    user: userId,
                });
                return comment;
            }
        },
        async deleteComment(parent, args, context) {
            checkJWT(context);
            const { commentId, parentCommentId } = args;
            if (parentCommentId) {
                const parentComment = await Comment.findOne({
                    parentComment: parentCommentId,
                });
                parentComment.replies = parentComment.replies.filter(
                    (id) => id.valueOf() !== commentId
                );
                const comment = await Comment.findOne({ _id: commentId });
                await Comment.deleteOne({ _id: commentId });
                parentComment.save();
                return comment;
            } else {
                const comment = await Comment.findOne({ _id: commentId });
                await Comment.deleteOne({ _id: commentId });
                return comment;
            }
        },
    },
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
        async parentComment(parent) {
            await parent.populate("parentComment");
            return parent.parent;
        },
    },
};

module.exports = { commentResolvers };
