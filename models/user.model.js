const { model, Schema } = require("mongoose");
const { isEmail } = require("validator");

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "User's email-id is required"],
            validate: [isEmail, "Please enter a valid email address"],
        },
        userName: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "User's password is required"],
        },
        name: {
            type: String,
            required: [true, "User's name is required"],
        },
        profilePicture: String,
        bio: String,
        location: String,
        url: String,
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        liked: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        bookmarked: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        createdAt: Number,
        updatedAt: Number,
    },
    { timestamps: true }
);

const User = model("User", UserSchema);

module.exports = { User };
