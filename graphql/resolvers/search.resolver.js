const { checkJWT } = require("../../utils/auth");
const { User } = require("../../models/user.model");
const { Post } = require("../../models/post.model");
const { usersIndex, postsIndex } = require("../../utils/generateSearchIndex");

const searchResolvers = {
    Query: {
        async getSearchResults(parent, args, context) {
            checkJWT(context);
            const { query } = args;

            const users = [
                ...new Set(
                    usersIndex.search({
                        query,
                        suggest: true,
                    })
                ),
            ];
            const posts = [
                ...new Set(
                    postsIndex.search({
                        query,
                        suggest: true,
                    })
                ),
            ];
            return { users, posts };
        },
    },
    Search: {
        async users(parent) {
            const userDocs = [];
            for (const user of parent.users) {
                const userDoc = await User.findOne({ _id: user });
                userDocs.push(userDoc);
            }
            return userDocs;
        },
        async posts(parent) {
            const postsDocs = [];
            for (const post of parent.posts) {
                const postDoc = await Post.findOne({ _id: post });
                postsDocs.push(postDoc);
            }
            return postsDocs;
        },
    },
};

module.exports = { searchResolvers };
