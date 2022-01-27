const { postResolvers } = require("./post.resolver");
const { userResolvers } = require("./user.resolver");
const { commentResolvers } = require("./comment.resolver");
const { notificationResolvers } = require("./notification.resolver");
const { searchResolvers } = require("./search.resolver");

const resolvers = {
    Query: {
        ...postResolvers.Query,
        ...userResolvers.Query,
        ...commentResolvers.Query,
        ...notificationResolvers.Query,
        ...searchResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Mutation,
        ...notificationResolvers.Mutation,
    },
    Post: postResolvers.Post,
    User: userResolvers.User,
    Comment: commentResolvers.Comment,
    Notification: notificationResolvers.Notification,
    Search: searchResolvers.Search,
};

module.exports = { resolvers };
