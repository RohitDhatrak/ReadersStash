import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App";

const client = new ApolloClient({
    uri: process.env.REACT_APP_SERVER_URI,
    cache: new InMemoryCache(),
});

export default function Provider() {
    return (
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    );
}
