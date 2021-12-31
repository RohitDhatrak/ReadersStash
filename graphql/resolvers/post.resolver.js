const { User } = require("../../models/user.model");
const { Post } = require("../../models/post.model");
const { Topic } = require("../../models/topic.model");
const { checkJWT } = require("../../utils/auth");
const { ForbiddenError } = require("apollo-server");

const postResolvers = {
    Query: {
        async getPosts(parent, args, context) {
            checkJWT(context);
            const posts = await Post.find();
            return posts;
        },
        async getPost(parent, args) {
            const { postId } = args;
            const post = await Post.findOne({ _id: postId });
            return post;
        },
    },
    Mutation: {
        async createPost(parent, args, context) {
            checkJWT(context);
            const {
                createPostInput: { title, body, userId, topics },
            } = args;
            const post = new Post({ title, body, user: userId, topics });
            await post.save();
            const userDoc = await User.findOne({ _id: userId });
            userDoc.posts.push(post._id);
            await userDoc.save();
            for (const topicId of topics) {
                const topic = await Topic.findOne({ _id: topicId });
                topic.posts.push(post._id);
                await topic.save();
            }
            return post;
        },
        async deletePost(parent, args, context) {
            checkJWT(context);
            const { postId, userId } = args;
            const post = await Post.findOne({ _id: postId });

            if (post.user.valueOf() === userId) {
                const userDoc = await User.findOne({ _id: userId });
                await Post.deleteOne({ _id: postId });
                userDoc.posts = userDoc.posts.filter(
                    (postId) => postId.valueOf() !== post._id
                );
                userDoc.save();
                for (const topicId of post.topics) {
                    const topic = await Topic.findOne({ _id: topicId });
                    topic.posts = topic.posts.filter(
                        (postId) => postId.valueOf() !== post._id
                    );
                    topic.save();
                }
                return post;
            } else {
                throw new ForbiddenError(
                    "user id doesn't match cannot delete post"
                );
            }
        },
        async likePost(parent, args, context) {
            checkJWT(context);
            const { postId, userId } = args;
            const post = await Post.findOne({ _id: postId });
            post.likes.push(userId);
            await post.save();
            const userDoc = await User.findOne({ _id: userId });
            userDoc.liked.push(postId);
            userDoc.save();
            return post;
        },
        async unlikePost(parent, args, context) {
            checkJWT(context);
            const { postId, userId } = args;
            const post = await Post.findOne({ _id: postId });
            post.likes = post.likes.filter((id) => id.valueOf() !== userId);
            await post.save();
            const userDoc = await User.findOne({ _id: userId });
            userDoc.liked = userDoc.liked.filter(
                (id) => id.valueOf() !== postId
            );
            userDoc.save();
            return post;
        },
        async bookmark(parent, args, context) {
            checkJWT(context);
            const { postId, userId } = args;
            const post = await Post.findOne({ _id: postId });
            post.bookmarks.push(userId);
            await post.save();
            const userDoc = await User.findOne({ _id: userId });
            userDoc.bookmarked.push(postId);
            userDoc.save();
            return post;
        },
        async removeBookmark(parent, args, context) {
            checkJWT(context);
            const { postId, userId } = args;
            const post = await Post.findOne({ _id: postId });
            post.bookmarks = post.bookmarks.filter(
                (id) => id.valueOf() !== userId
            );
            await post.save();
            const userDoc = await User.findOne({ _id: userId });
            userDoc.bookmarked = userDoc.bookmarked.filter(
                (id) => id.valueOf() !== postId
            );
            userDoc.save();
            return post;
        },
    },
    Post: {
        async user(parent) {
            await parent.populate("user");
            return parent.user;
        },
        async likes(parent) {
            await parent.populate("likes");
            return parent.likes;
        },
        async bookmarks(parent) {
            await parent.populate("bookmarks");
            return parent.bookmarks;
        },
        async topics(parent) {
            await parent.populate("topics");
            return parent.topics;
        },
        likesCount(parent) {
            return parent.likes.length;
        },
        commentsCount(parent) {
            return parent.comments.length;
        },
    },
};

module.exports = { postResolvers };
