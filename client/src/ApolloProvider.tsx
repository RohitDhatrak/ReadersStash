import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from "@apollo/client";
import { BrowserRouter as Router } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";
import { getUserFromLocalStorage } from "./utils/localStorageOperations";
import App from "./App";

const httpLink = createHttpLink({
    uri: process.env.REACT_APP_SERVER_URI,
});

const authLink = setContext((_, { headers }) => {
    const user = JSON.parse(getUserFromLocalStorage());
    return {
        headers: {
            ...headers,
            Authorization: user?.jwt ? user.jwt : "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default function Provider() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <App />
            </Router>
        </ApolloProvider>
    );
}
