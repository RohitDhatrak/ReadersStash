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
