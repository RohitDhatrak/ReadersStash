const { Index } = require("flexsearch");
const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");

const postsIndex = new Index({ tokenize: "forward" });
const usersIndex = new Index({ tokenize: "forward" });

async function generateSearchIndex() {
    const posts = await Post.find();
    const users = await User.find();

    for (const post of posts) {
        await post.populate("user");
        postsIndex.add(post._id.valueOf(), post.title.trim());
        postsIndex.append(post._id.valueOf(), post.body.trim());
        postsIndex.append(post._id.valueOf(), post.user.userName.trim());
        postsIndex.append(post._id.valueOf(), post.user.name.trim());
        if (post.user?.bio?.trim())
            postsIndex.append(post._id.valueOf(), post.user.bio.trim());
    }

    for (const user of users) {
        usersIndex.add(user._id.valueOf(), user.userName.trim());
        usersIndex.append(user._id.valueOf(), user.name.trim());
        if (user?.bio?.trim())
            usersIndex.append(user._id.valueOf(), user.bio.trim());
    }

    console.log("Search index generated successfully");
}

module.exports = {
    postsIndex,
    usersIndex,
    generateSearchIndex,
};
