const { model, Schema } = require("mongoose");

const NotificationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User id is required"],
        },
        from: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User id is required"],
        },
        type: {
            type: String,
            required: [true, "Type is required"],
        },
        isRead: {
            type: Boolean,
            required: [true, "Notification status is required"],
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
        createdAt: Number,
        updatedAt: Number,
    },
    { timestamps: true }
);

const Notification = model("Notification", NotificationSchema);

module.exports = { Notification };
