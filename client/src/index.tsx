import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { store } from "./app/store";
import { Provider } from "react-redux";
import ApolloProvider from "./ApolloProvider";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ApolloProvider />
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
