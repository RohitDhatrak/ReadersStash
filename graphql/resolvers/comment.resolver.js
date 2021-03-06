const { Comment } = require("../../models/comment.model");
const { Notification } = require("../../models/notification.model");
const { Post } = require("../../models/post.model");
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
            const { body, userId, postId, parentCommentId } = args;

            if (parentCommentId) {
                const comment = await Comment.findOne({ _id: parentCommentId });
                const reply = new Comment({
                    body,
                    user: userId,
                    parentComment: parentCommentId,
                    level: 2,
                });
                await reply.save();
                comment.replies.push(reply._id);
                await comment.save();
                if (comment.user.valueOf() !== userId) {
                    const notification = new Notification({
                        user: comment.user,
                        from: userId,
                        type: "Reply",
                        post: postId,
                        comment: reply._id,
                        isRead: false,
                    });
                    await notification.save();
                }
                return comment;
            } else {
                const post = await Post.findOne({ _id: postId });
                const comment = new Comment({
                    body,
                    user: userId,
                    level: 1,
                });
                await comment.save();
                post.comments.push(comment._id);
                await post.save();
                if (post.user.valueOf() !== userId) {
                    const notification = new Notification({
                        user: post.user,
                        from: userId,
                        type: "Comment",
                        post: post._id,
                        comment: comment._id,
                        isRead: false,
                    });
                    await notification.save();
                }
                return comment;
            }
        },
        async deleteComment(parent, args, context) {
            checkJWT(context);
            const { commentId, postId, parentCommentId } = args;

            if (parentCommentId) {
                const parentComment = await Comment.findOne({
                    _id: parentCommentId,
                });
                parentComment.replies = parentComment.replies.filter(
                    (id) => id.valueOf() !== commentId
                );
                const comment = await Comment.findOne({
                    _id: commentId,
                });
                await Comment.deleteOne({ _id: commentId });
                await parentComment.save();
                await Notification.deleteOne({
                    user: parentComment.user,
                    from: comment.user,
                    type: "Reply",
                    post: postId,
                    comment: commentId,
                });
                return parentComment;
            } else {
                const comment = await Comment.findOne({ _id: commentId });
                const post = await Post.findOne({ _id: postId });
                post.comments = post.comments.filter(
                    (id) => id.valueOf() !== commentId
                );
                post.save();
                await Comment.deleteOne({ _id: commentId });
                await Notification.deleteOne({
                    user: post.user,
                    from: comment.user,
                    comment: commentId,
                    type: "Comment",
                    post: post._id,
                });
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
    },
};

module.exports = { commentResolvers };
