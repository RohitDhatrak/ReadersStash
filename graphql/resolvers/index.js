const { postResolvers } = require("./post.resolver");
const { userResolvers } = require("./user.resolver");
const { commentResolvers } = require("./comment.resolver");
const { notificationResolvers } = require("./notification.resolver");
const { topicResolvers } = require("./topic.resolver");
const { searchResolvers } = require("./search.resolver");

const resolvers = {
    Query: {
        ...postResolvers.Query,
        ...userResolvers.Query,
        ...commentResolvers.Query,
        ...notificationResolvers.Query,
        ...topicResolvers.Query,
        ...searchResolvers.Query,
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
    Search: searchResolvers.Search,
};

module.exports = { resolvers };
