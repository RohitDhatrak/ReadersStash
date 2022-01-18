import { gql } from "@apollo/client";

export const SIGN_UP = gql`
    mutation signup(
        $userName: String!
        $password: String!
        $email: String!
        $name: String!
    ) {
        signup(
            signupInput: {
                userName: $userName
                password: $password
                email: $email
                name: $name
            }
        ) {
            _id
            userName
            name
            profilePicture
            jwt
        }
    }
`;

export const LOGIN = gql`
    mutation login($userName: String!, $password: String!) {
        login(userName: $userName, password: $password) {
            _id
            userName
            name
            profilePicture
            jwt
        }
    }
`;

export const ADD_POST = gql`
    mutation createPost(
        $title: String!
        $body: String!
        $image: String
        $userId: ID!
    ) {
        createPost(
            createPostInput: {
                title: $title
                body: $body
                image: $image
                userId: $userId
            }
        ) {
            _id
            title
            body
            image
            user {
                _id
                userName
                name
                profilePicture
            }
            likesCount
            commentsCount
        }
    }
`;

export const DELETE_POST = gql`
    mutation deletePost($postId: ID!, $userId: ID!) {
        deletePost(postId: $postId, userId: $userId) {
            _id
        }
    }
`;

export const LIKE_POST = gql`
    mutation likePost($postId: ID!, $userId: ID!) {
        likePost(postId: $postId, userId: $userId) {
            _id
            title
            body
            image
            user {
                _id
                userName
                name
                profilePicture
            }
            likesCount
            commentsCount
        }
    }
`;

export const UNLIKE_POST = gql`
    mutation unlikePost($postId: ID!, $userId: ID!) {
        unlikePost(postId: $postId, userId: $userId) {
            _id
            title
            body
            image
            user {
                _id
                userName
                name
                profilePicture
            }
            likesCount
            commentsCount
        }
    }
`;

export const BOOKMARK = gql`
    mutation bookmark($postId: ID!, $userId: ID!) {
        bookmark(postId: $postId, userId: $userId) {
            _id
            title
            body
            image
            user {
                _id
                userName
                name
                profilePicture
            }
            likesCount
            commentsCount
        }
    }
`;

export const REMOVE_BOOKMARK = gql`
    mutation removeBookmark($postId: ID!, $userId: ID!) {
        removeBookmark(postId: $postId, userId: $userId) {
            _id
            title
            body
            image
            user {
                _id
                userName
                name
                profilePicture
            }
            likesCount
            commentsCount
        }
    }
`;

export const ADD_COMMENT = gql`
    mutation addComment(
        $body: String!
        $userId: ID!
        $postId: ID!
        $parentCommentId: ID
    ) {
        addComment(
            body: $body
            userId: $userId
            postId: $postId
            parentCommentId: $parentCommentId
        ) {
            _id
            body
            user {
                _id
                userName
                name
                profilePicture
            }
        }
    }
`;
