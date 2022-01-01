import { gql } from "@apollo/client";

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
        }
    }
`;
