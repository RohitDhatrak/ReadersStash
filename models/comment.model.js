const { model, Schema } = require("mongoose");

const CommentSchema = new Schema(
    {
        body: { type: String, required: [true, "Comment body is required"] },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User id is required"],
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        replies: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        parentComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
        createdAt: Number,
        updatedAt: Number,
    },
    { timestamps: true }
);

const Comment = model("Comment", CommentSchema);

module.exports = { Comment };
