const gql = require("graphql-tag");

const typeDefs = gql`
    type Post {
        id: ID
        title: String!
        body: String!
        userId: User!
        likes: [User]
        bookmarks: [User]
        # comments: [Comment]
        # topics: [Topic]
        createdAt: String
        updatedAt: String
    }
    type User {
        _id: ID!
        email: String!
        userName: String!
        name: String!
        jwt: String!
        profilePicture: String
        bio: String
        location: String
        url: String
        followers: [User]
        following: [User]
        posts: [Post]
        liked: [Post]
        bookmarks: [Post]
        createdAt: String
        updatedAt: String
    }
    input SignupInput {
        userName: String!
        password: String!
        email: String!
        name: String!
    }
    type Query {
        getPosts: [Post]
        getPost: Post
    }
    type Mutation {
        signup(signupInput: SignupInput): User!
        login(userName: String, password: String): User!
        # createPost()
        # deletePost()
    }
`;

module.exports = { typeDefs };
