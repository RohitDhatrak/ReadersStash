const { User } = require("../../models/user.model");
const { Post } = require("../../models/post.model");
const { Notification } = require("../../models/notification.model");
const { checkJWT } = require("../../utils/auth");
const { ForbiddenError } = require("apollo-server");
const { cloudinary } = require("../../utils/cloudinary");
const { postsIndex } = require("../../utils/generateSearchIndex");

const postResolvers = {
    Query: {
        async getPosts(parent, args, context) {
            checkJWT(context);
            const posts = await Post.find().sort({ createdAt: -1 });
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
            let {
                createPostInput: { title, body, userId, image },
            } = args;
            if (image) {
                const { url } = await cloudinary.uploader.upload(image, {
                    upload_preset: "social_media",
                });
                image = url;
            }
            const post = new Post({ title, body, user: userId, image });
            await post.save();
            const userDoc = await User.findOne({ _id: userId });
            userDoc.posts.push(post._id);
            await userDoc.save();
            postsIndex.add(post._id, post.title.trim());
            postsIndex.appendAsync(post._id, post.body.trim());
            postsIndex.appendAsync(post._id, userDoc.userName.trim());
            postsIndex.appendAsync(post._id, userDoc.name.trim());
            if (userDoc?.bio?.trim())
                postsIndex.appendAsync(post._id, userDoc.bio.trim());
            return post;
        },
        async deletePost(parent, args, context) {
            checkJWT(context);
            const { postId, userId } = args;
            const post = await Post.findOne({ _id: postId });

            if (post.user.valueOf() === userId) {
                const userDoc = await User.findOne({ _id: userId });
                if (post?.image) {
                    const imageId = post.image.split("/")[7].split(".")[0];
                    await cloudinary.uploader.destroy(imageId);
                }
                await Post.deleteOne({ _id: postId });
                userDoc.posts = userDoc.posts.filter(
                    (postId) => postId.valueOf() !== post._id
                );
                userDoc.save();
                postsIndex.removeAsync(post._id);
                await Notification.deleteMany({
                    post: post._id,
                });
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

            if (post.user.valueOf() !== userId) {
                const notification = new Notification({
                    user: post.user,
                    from: userId,
                    type: "Like",
                    post: post._id,
                    isRead: false,
                });
                await notification.save();
            }
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
            await Notification.deleteOne({
                type: "Like",
                from: userId,
                post: post._id,
            });
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
        async comments(parent) {
            await parent.populate("comments");
            const promises = parent.comments.map(async (comment) => {
                await comment.populate("replies");
                await comment.populate("user");

                const promises = comment.replies.map(async (reply) => {
                    await comment.populate("user");
                });
                await Promise.all(promises);
            });
            await Promise.all(promises);
            return parent.comments;
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
