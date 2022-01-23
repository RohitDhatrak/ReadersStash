import { gql } from "@apollo/client";

export const GET_POST = gql`
    query GetPost($postId: ID!) {
        getPost(postId: $postId) {
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
            comments {
                _id
                body
                level
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
                user {
                    _id
                    userName
                    name
                    profilePicture
                }
            }
        }
    }
`;

export const GET_POSTS = gql`
    query {
        getPosts {
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

export const GET_INITIAL_DATA = gql`
    query User($userId: ID!) {
        getUser(userId: $userId) {
            _id
            userName
            name
            profilePicture
            likesHashMap
            bookmarksHashMap
            followingHashMap
        }
    }
`;

export const GET_PROFILE_DATA = gql`
    query Profile($userName: String!) {
        getUser(userName: $userName) {
            _id
            email
            userName
            name
            profilePicture
            bio
            location
            url
            followersCount
            followingCount
            posts {
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
            liked {
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
            bookmarked {
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
    }
`;

export const GET_FOLLOWERS = gql`
    query getFollowers($userName: String!) {
        getUser(userName: $userName) {
            followers {
                _id
                name
                userName
                profilePicture
                bio
            }
        }
    }
`;

export const GET_FOLLOWING = gql`
    query getFollowing($userName: String!) {
        getUser(userName: $userName) {
            following {
                _id
                name
                userName
                profilePicture
                bio
            }
        }
    }
`;

export const GET_LIKES = gql`
    query getLikes($postId: ID!) {
        getPost(postId: $postId) {
            likes {
                _id
                name
                userName
                profilePicture
                bio
            }
        }
    }
`;
