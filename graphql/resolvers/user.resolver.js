const { encrypt, decrypt } = require("../../utils/hashOperations");
const { signToken } = require("../../utils/tokenOperations");
const { User } = require("../../models/user.model");
const { Post } = require("../../models/post.model");
const { UserInputError } = require("apollo-server");
const { checkJWT } = require("../../utils/auth");

const userResolvers = {
    Query: {
        async getUser(parent, args) {
            const { userId } = args;
            const user = await User.findOne({ _id: userId });
            return user;
        },
    },
    Mutation: {
        async signup(parent, args) {
            const {
                signupInput: { userName, password, email, name },
            } = args;
            const user = await User.findOne({ userName });
            if (user) {
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "This username is already taken",
                    },
                });
            } else {
                const encryptedPassword = await encrypt(password);
                const newUser = new User({
                    userName,
                    password: encryptedPassword,
                    email,
                    name,
                });
                await newUser.save();
                const jwt = signToken(newUser._id);
                return { ...newUser._doc, jwt };
            }
        },
        async login(parent, args) {
            const { userName, password } = args;
            const user = await User.findOne({ userName });

            if (user) {
                const doesMatch = await decrypt(user.password, password);
                if (doesMatch) {
                    const jwt = signToken(user.id);
                    return { ...user._doc, jwt };
                } else {
                    throw new UserInputError("Password does not match", {
                        errors: {
                            password: "The password is incorrect",
                        },
                    });
                }
            } else {
                throw new UserInputError("This user is not registered", {
                    errors: {
                        username: "This user is not registered",
                    },
                });
            }
        },
    },
    User: {
        async followers(parent) {
            const user = await User.findOne({ _id: parent._id });
            await user.populate("followers");
            return user.followers;
        },
        async following(parent) {
            const user = await User.findOne({ _id: parent._id });
            await user.populate("following");
            return user.following;
        },
        async posts(parent) {
            const post = await User.findOne({ _id: parent._id });
            await post.populate("posts");
            return post.posts;
        },
        async liked(parent) {
            const post = await User.findOne({ _id: parent._id });
            await post.populate("liked");
            return post.liked;
        },
        async bookmarks(parent) {
            const post = await User.findOne({ _id: parent._id });
            await post.populate("bookmarks");
            return post.bookmarks;
        },
    },
};

module.exports = { userResolvers };
