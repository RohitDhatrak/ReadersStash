const { ApolloServer } = require("apollo-server");
const { initializeDBConnection } = require("./db/db.connect");
const { typeDefs } = require("./graphql/typeDefs");
const { resolvers } = require("./graphql/resolvers");
const { generateSearchIndex } = require("./utils/generateSearchIndex");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
});

initializeDBConnection();

server.listen({ port: process.env.PORT || 4444 }).then((res) => {
    console.log("Server listening on port " + res.url);
});

generateSearchIndex();
