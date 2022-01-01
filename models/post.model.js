const { model, Schema } = require("mongoose");

const PostSchema = new Schema(
    {
        title: { type: String, required: [true, "Title is required"] },
        body: { type: String, required: [true, "Body is required"] },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User id is required"],
        },
        image: String,
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        bookmarks: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        topics: [
            {
                type: Schema.Types.ObjectId,
                ref: "Topic",
            },
        ],
        createdAt: Number,
        updatedAt: Number,
    },
    { timestamps: true }
);

const Post = model("Post", PostSchema);

module.exports = { Post };
