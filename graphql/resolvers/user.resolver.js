const { encrypt, decrypt } = require("../../utils/hashOperations");
const { signToken } = require("../../utils/tokenOperations");
const { User } = require("../../models/user.model");
const { Post } = require("../../models/post.model");
const { UserInputError } = require("apollo-server");
const { checkJWT } = require("../../utils/auth");

const userResolvers = {
    Query: {
        async getUser(parent, args, context) {
            checkJWT(context);
            const { userId, userName } = args;
            if (userId) {
                const user = await User.findOne({ _id: userId });
                return user;
            } else {
                const user = await User.findOne({ userName });
                return user;
            }
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
                    const jwt = signToken(user._id);
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
        async followUser(parent, args, context) {
            checkJWT(context);
            const { userId, otherUserId } = args;
            const user = await User.findOne({ _id: userId });
            const otherUser = await User.findOne({ _id: otherUserId });
            user.following.push(otherUserId);
            otherUser.followers.push(userId);
            return user;
        },
        async unfollowUser(parent, args, context) {
            checkJWT(context);
            const { userId, otherUserId } = args;
            const user = await User.findOne({ _id: userId });
            const otherUser = await User.findOne({ _id: otherUserId });
            user.following = user.following.filter(
                (id) => id.valueOf() !== otherUserId
            );
            otherUser.followers = otherUser.followers.filter(
                (id) => id.valueOf() !== userId
            );
            user.save();
            otherUser.save();
            return user;
        },
        async updateProfile(parent, args, context) {
            const {
                userId,
                email,
                userName,
                name,
                profilePicture,
                bio,
                location,
                url,
            } = args;
            const user = await User.findOne({ _id: userId });
            user.email = email;
            user.userName = userName;
            user.name = name;
            user.profilePicture = profilePicture;
            user.bio = bio;
            user.location = location;
            user.url = url;
            await user.save();
            return user;
        },
    },
    User: {
        async followers(parent) {
            await parent.populate("followers");
            return parent.followers;
        },
        followersCount(parent) {
            return parent.followers.length;
        },
        async following(parent) {
            await parent.populate("following");
            return parent.following;
        },
        followingCount(parent) {
            return parent.following.length;
        },
        async posts(parent) {
            await parent.populate("posts");
            return parent.posts;
        },
        async liked(parent) {
            await parent.populate("liked");
            return parent.liked;
        },
        async bookmarked(parent) {
            await parent.populate("bookmarked");
            return parent.bookmarked;
        },
    },
};

module.exports = { userResolvers };
