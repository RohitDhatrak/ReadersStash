import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
    PrivateRoute,
    Header,
    SidePannel,
    SidePannelMinimal,
} from "./components";
import { Container } from "./components/Shared";
import { Post } from "./types";
import { GET_INITIAL_DATA } from "./graphql/queries";
import { getUserFromLocalStorage } from "./utils/localStorageOperations";
import { useAppDispatch } from "./app/hooks";
import { Page404, LandingPage } from "./pages";
import { Feed, Login, Signup, NewPost, Profile } from "./features";
import { login } from "./features/user/userSlice";

function App() {
    const user = JSON.parse(getUserFromLocalStorage());
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useQuery(GET_INITIAL_DATA, {
        onError(error) {
            if (error?.graphQLErrors[0].extensions.code === "UNAUTHENTICATED") {
                navigate("/landing");
                localStorage.setItem(
                    "user",
                    JSON.stringify({ _id: null, jwt: null })
                );
            }
            setIsLoading(false);
        },
        onCompleted(data) {
            dispatch(login(data.getUser));
            setIsLoading(false);
            // console.log({ data });
        },
        variables: {
            userId: user?._id ? user._id : "",
        },
    });

    if (isLoading) return <p>Loading...</p>;

    return (
        <Container>
            <Header />
            <SidePannel />
            <SidePannelMinimal />
            <Routes>
                <Route
                    path="/"
                    element={
                        <PrivateRoute path="/">
                            <Feed />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/newpost"
                    element={
                        <PrivateRoute path="/newpost">
                            <NewPost />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/:userName"
                    element={
                        <PrivateRoute path={`${pathname}`}>
                            <Profile />
                        </PrivateRoute>
                    }
                />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </Container>
    );
}

export default App;
