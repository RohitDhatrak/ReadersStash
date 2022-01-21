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
            level
            user {
                _id
                userName
                name
                profilePicture
            }
            replies {
                _id
                body
                level
                user {
                    _id
                    userName
                    name
                    profilePicture
                }
                parentComment
            }
        }
    }
`;

export const DELETE_COMMENT = gql`
    mutation deleteComment(
        $commentId: ID!
        $postId: ID!
        $parentCommentId: ID
    ) {
        deleteComment(
            commentId: $commentId
            postId: $postId
            parentCommentId: $parentCommentId
        ) {
            _id
            body
            level
            user {
                _id
                userName
                name
                profilePicture
            }
            replies {
                _id
                body
                level
                user {
                    _id
                    userName
                    name
                    profilePicture
                }
                parentComment
            }
        }
    }
`;

export const FOLLOW_USER = gql`
    mutation followUser($userId: ID!, $otherUserId: ID!) {
        followUser(userId: $userId, otherUserId: $otherUserId) {
            _id
        }
    }
`;

export const UNFOLLOW_USER = gql`
    mutation unfollowUser($userId: ID!, $otherUserId: ID!) {
        unfollowUser(userId: $userId, otherUserId: $otherUserId) {
            _id
        }
    }
`;

export const CHANGE_PASSWORD = gql`
    mutation changePassword(
        $userId: ID!
        $password: String!
        $newPassword: String!
    ) {
        changePassword(
            userId: $userId
            password: $password
            newPassword: $newPassword
        ) {
            _id
        }
    }
`;

export const UPDATE_PROFILE = gql`
    mutation updateProfile(
        $userId: ID!
        $email: String!
        $name: String!
        $profilePicture: String!
        $bio: String!
        $url: String!
    ) {
        updateProfile(
            updateProfileInput: {
                userId: $userId
                email: $email
                name: $name
                profilePicture: $profilePicture
                bio: $bio
                url: $url
            }
        ) {
            _id
            email
            name
            profilePicture
            bio
            url
        }
    }
`;
