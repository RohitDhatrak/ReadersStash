const { User } = require("../../models/user.model");
const { Post } = require("../../models/post.model");
const { Topic } = require("../../models/topic.model");
const { checkJWT } = require("../../utils/auth");

const topicResolvers = {
    Query: {
        async getTopics(parent, args, context) {
            checkJWT(context);
            const topics = await Topic.find();
            return topics;
        },
        async getTopic(parent, args, context) {
            checkJWT(context);
            const { topicId } = args;
            const topic = await Topic.findOne({ _id: topicId });
            return topic;
        },
    },
    Mutation: {
        async addTopic(parent, args, context) {
            checkJWT(context);
            const { name } = args;
            const topic = new Topic({ name });
            await topic.save();
            return topic;
        },
    },
    Topic: {
        async posts(parent) {
            await parent.populate("posts");
            return parent.posts;
        },
    },
};

module.exports = { topicResolvers };
