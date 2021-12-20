const { model, Schema } = require("mongoose");

const TopicSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Topic name is required"],
        },
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
                required: [true, "Post id is required"],
            },
        ],
        createdAt: Number,
        updatedAt: Number,
    },
    { timestamps: true }
);

const Topic = model("Topic", TopicSchema);

module.exports = { Topic };
