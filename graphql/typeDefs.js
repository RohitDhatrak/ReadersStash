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
        parentComment: Comment
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
        posts: [Post]
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
        topics: [String]
    }
    input UpdateProfileInput {
        userId: ID!
        email: String!
        userName: String!
        name: String!
        profilePicture: String
        bio: String
        location: String
        url: String
    }
    type Query {
        getPosts: [Post]!
        getPost(postId: ID!): Post!
        getUser(userId: ID, userName: String): User!
        getTopics: [Topic]!
        getTopic(topicId: ID!): Topic!
        getComments(postId: ID!): [Comment]!
        # getNotifications
    }
    type Mutation {
        signup(signupInput: SignupInput!): User!
        login(userName: String!, password: String!): User!
        createPost(createPostInput: CreatePostInput!): Post!
        deletePost(postId: ID!, userId: ID!): Post!
        likePost(postId: ID!, userId: ID!): Post!
        unlikePost(postId: ID!, userId: ID!): Post!
        bookmark(postId: ID!, userId: ID!): Post!
        removeBookmark(postId: ID!, userId: ID!): Post!
        addComment(body: String!, userId: ID!, parentCommentId: ID): Comment!
        deleteComment(commentId: ID!, parentCommentId: ID): Comment!
        followUser(userId: ID!, otherUserId: ID!): User!
        unfollowUser(userId: ID!, otherUserId: ID!): User!
        updateProfile(updateProfileInput: UpdateProfileInput!): User!
        addTopic(name: String!): Topic!
        # set notifications
    }
`;

module.exports = { typeDefs };
