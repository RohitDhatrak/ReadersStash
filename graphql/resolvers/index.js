const { postResolvers } = require("./post.resolver");
const { userResolvers } = require("./user.resolver");

const resolvers = {
    Query: {
        ...postResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
    },
};

module.exports = { resolvers };
