const { User } = require("../../models/user.model");
const { Post } = require("../../models/post.model");
const { checkJWT } = require("../../utils/auth");
const { ForbiddenError } = require("apollo-server");

const postResolvers = {
    Query: {
        async getPosts() {
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
                createPostInput: { title, body, user, topics },
            } = args;
            const post = new Post({ title, body, user, topics });
            await post.save();
            const userDoc = await User.findOne({ _id: user });
            userDoc.posts.push(post._id);
            await userDoc.save();
            return post;
        },
        async deletePost(parent, args, context) {
            checkJWT(context);
            const { postId, userId } = args;
            const post = Post.findOne({ _id: postId });

            if (post.user === userId) {
                await Post.deleteOne({ _id: postId });
                const userDoc = await User.findOne({ _id: userId });
                userDoc.posts.filter((postId) => postId !== post._id);
                userDoc.save();
                return post;
            } else {
                throw new ForbiddenError(
                    "user id doesn't match cannot delete post"
                );
            }
        },
    },
    Post: {
        async user(parent) {
            const user = await User.findOne({ _id: parent.user });
            return user;
        },
        async likes(parent) {
            const post = await Post.findOne({ _id: parent._id });
            if (post) {
                await post.populate("likes");
                return post.likes;
            } else {
                return [];
            }
        },
        async topics() {
            const post = await Post.findOne({ _id: parent._id });
            if (post) {
                await post.populate("topics");
                return post.topics;
            } else {
                return [];
            }
        },
    },
};

module.exports = { postResolvers };
