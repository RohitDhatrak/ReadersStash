const { encrypt, decrypt } = require("../../utils/hashOperations");
const { signToken } = require("../../utils/tokenOperations");
const { User } = require("../../models/user.model");
const { Notification } = require("../../models/notification.model");
const { UserInputError } = require("apollo-server");
const { checkJWT } = require("../../utils/auth");
const { cloudinary } = require("../../utils/cloudinary");
const { usersIndex } = require("../../utils/generateSearchIndex");

const userResolvers = {
    Query: {
        async getUser(parent, args) {
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
                const profilePicture =
                    "https://res.cloudinary.com/rohitdhatrak/image/upload/v1641039008/uctgqsdfcgesusplshme.png";
                const newUser = new User({
                    userName,
                    password: encryptedPassword,
                    email,
                    name,
                    profilePicture,
                });
                await newUser.save();
                const jwt = signToken(newUser._id);
                usersIndex.add(newUser._id, newUser.userName.trim());
                usersIndex.appendAsync(newUser._id, newUser.name.trim());
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
            await user.save();
            await otherUser.save();
            const notification = new Notification({
                user: otherUserId,
                from: userId,
                type: "Follow",
                isRead: false,
            });
            await notification.save();
            return otherUser;
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
            await user.save();
            await otherUser.save();
            await Notification.deleteOne({
                user: otherUserId,
                from: userId,
                type: "Follow",
            });
            return otherUser;
        },
        async updateProfile(parent, args, context) {
            let {
                updateProfileInput: {
                    userId,
                    email,
                    name,
                    profilePicture,
                    bio,
                    url,
                },
            } = args;
            const user = await User.findOne({ _id: userId });
            if (profilePicture !== user.profilePicture) {
                const { url } = await cloudinary.uploader.upload(
                    profilePicture,
                    {
                        upload_preset: "social_media",
                    }
                );
                const imageId = user.profilePicture.split("/")[7].split(".")[0];
                if (imageId !== "uctgqsdfcgesusplshme")
                    await cloudinary.uploader.destroy(imageId);
                profilePicture = url;
                user.profilePicture = profilePicture;
            }
            user.email = email;
            user.name = name;
            user.bio = bio;
            user.url = url;
            await user.save();
            usersIndex.remove(user._id);
            usersIndex.add(userId, user.userName.trim());
            usersIndex.appendAsync(userId, user.name.trim());
            if (user?.bio?.trim()) {
                usersIndex.appendAsync(userId, user.bio.trim());
            }
            return user;
        },
        async changePassword(parent, args) {
            const { userId, password, newPassword } = args;
            const user = await User.findOne({ _id: userId });

            if (user) {
                const doesMatch = await decrypt(user.password, password);
                if (doesMatch) {
                    const encryptedPassword = await encrypt(newPassword);
                    user.password = encryptedPassword;
                    await user.save();
                    return user._doc;
                } else {
                    throw new UserInputError(
                        "The old password does not match",
                        {
                            errors: {
                                password: "The old password does not match",
                            },
                        }
                    );
                }
            } else {
                throw new UserInputError(
                    "Some error occured please try again later",
                    {
                        errors: {
                            username:
                                "Some error occured please try again later",
                        },
                    }
                );
            }
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
        likesHashMap(parent) {
            const map = {};
            for (const postId of parent.liked) {
                map[postId] = true;
            }
            return map;
        },
        bookmarksHashMap(parent) {
            const map = {};
            for (const postId of parent.bookmarked) {
                map[postId] = true;
            }
            return map;
        },
        followingHashMap(parent) {
            const map = {};
            for (const userId of parent.following) {
                map[userId] = true;
            }
            return map;
        },
    },
};

module.exports = { userResolvers };
