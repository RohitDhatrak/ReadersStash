const { model, Schema } = require("mongoose");

const NotificationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User id is required"],
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: [true, "Post id is required"],
        },
        type: {
            type: "Follow" | "Like" | "Comment" | "Mention",
            required: [true, "Type is required"],
        },
        createdAt: Number,
        updatedAt: Number,
    },
    { timestamps: true }
);

const Notification = model("Notification", NotificationSchema);

module.exports = { Notification };
