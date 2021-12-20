const { postResolvers } = require("./post.resolver");
const { userResolvers } = require("./user.resolver");
const { commentResolvers } = require("./comment.resolver");
const { notificationResolvers } = require("./notification.resolver");
const { topicResolvers } = require("./topic.resolver");

const resolvers = {
    Query: {
        ...postResolvers.Query,
        ...userResolvers.Query,
        ...commentResolvers.Query,
        ...notificationResolvers.Query,
        ...topicResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Mutation,
        ...notificationResolvers.Mutation,
        ...topicResolvers.Mutation,
    },
    Post: postResolvers.Post,
    User: userResolvers.User,
    Comment: commentResolvers.Comment,
    Notification: notificationResolvers.Notification,
    Topic: topicResolvers.Topic,
};

module.exports = { resolvers };
