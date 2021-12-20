const gql = require("graphql-tag");

const typeDefs = gql`
    type User {
        _id: ID!
        email: String!
        userName: String!
        name: String!
        jwt: String
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
    type Post {
        _id: ID!
        title: String!
        body: String!
        user: User!
        likes: [User]
        comments: [Comment]
        topics: [Topic]
        createdAt: String
        updatedAt: String
    }
    type Comment {
        _id: ID!
        body: String!
        user: User!
        likes: [User]!
        replies: [Comment]!
        createdAt: String
        updatedAt: String
    }
    type Notification {
        _id: ID!
        user: User!
        type: String!
        isRead: Boolean!
        post: Post
        createdAt: String
        updatedAt: String
    }
    type Topic {
        _id: ID!
        name: String!
        posts: [Post]!
    }
    input SignupInput {
        userName: String!
        password: String!
        email: String!
        name: String!
    }
    input createPostInput {
        title: String!
        body: String!
        user: String!
        topics: [String]!
    }
    type Query {
        getPosts: [Post]!
        getPost(postId: ID): Post!
        getUser(userId: ID): User!
        # getNotifications
    }
    type Mutation {
        signup(signupInput: SignupInput): User!
        login(userName: String, password: String): User!
        createPost(createPostInput: createPostInput): Post!
        deletePost(postId: ID, userId: ID): Post!
        # like/unlike post
        # bookmark/remove bookmark
        # add/delete comment
        # follow/unfollow user
        # update profile
    }
`;

module.exports = { typeDefs };
