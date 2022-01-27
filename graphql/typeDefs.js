const gql = require("graphql-tag");
const { GraphQLJSON, GraphQLJSONObject } = require("graphql-type-json");

const typeDefs = gql`
    scalar JSON
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
        followersCount: Int
        following: [User]
        followingCount: Int
        posts: [Post]
        liked: [Post]
        bookmarked: [Post]
        createdAt: String
        updatedAt: String
        likesHashMap: JSON
        bookmarksHashMap: JSON
        followingHashMap: JSON
    }
    type Post {
        _id: ID!
        title: String!
        body: String!
        user: User!
        image: String
        likes: [User]
        likesCount: Int
        bookmarks: [User]
        comments: [Comment]
        commentsCount: Int
        createdAt: String
        updatedAt: String
    }
    type Comment {
        _id: ID!
        body: String!
        user: User!
        likes: [User]!
        replies: [Comment]!
        level: Int!
        parentComment: ID
        createdAt: String
        updatedAt: String
    }
    type Notification {
        _id: ID!
        user: User!
        from: User!
        type: String!
        isRead: Boolean!
        post: Post
        comment: Comment
        createdAt: String
        updatedAt: String
    }
    type Search {
        posts: [Post]!
        users: [User]!
    }
    input SignupInput {
        userName: String!
        password: String!
        email: String!
        name: String!
    }
    input CreatePostInput {
        title: String!
        body: String!
        image: String
        userId: ID!
    }
    input UpdateProfileInput {
        userId: ID!
        email: String!
        name: String!
        profilePicture: String!
        bio: String!
        url: String!
    }
    type Query {
        getPosts: [Post]!
        getPost(postId: ID!): Post!
        getUser(userId: ID, userName: String): User!
        getComments(postId: ID!): [Comment]!
        getSearchResults(query: String!): Search!
        getNotifications(userId: ID!, count: Int!): [Notification]!
    }
    type Mutation {
        signup(signupInput: SignupInput!): User!
        login(userName: String!, password: String!): User!
        changePassword(
            userId: ID!
            password: String!
            newPassword: String!
        ): User!
        createPost(createPostInput: CreatePostInput!): Post!
        deletePost(postId: ID!, userId: ID!): Post!
        likePost(postId: ID!, userId: ID!): Post!
        unlikePost(postId: ID!, userId: ID!): Post!
        bookmark(postId: ID!, userId: ID!): Post!
        removeBookmark(postId: ID!, userId: ID!): Post!
        addComment(
            body: String!
            userId: ID!
            postId: ID!
            parentCommentId: ID
        ): Comment!
        deleteComment(
            commentId: ID!
            postId: ID!
            parentCommentId: ID
        ): Comment!
        followUser(userId: ID!, otherUserId: ID!): User!
        unfollowUser(userId: ID!, otherUserId: ID!): User!
        updateProfile(updateProfileInput: UpdateProfileInput!): User!
        markAsRead(userId: ID!): [Notification]!
    }
`;

module.exports = { typeDefs };
