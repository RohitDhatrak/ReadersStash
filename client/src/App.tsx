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
import { GET_INITIAL_DATA, GET_POSTS } from "./graphql/queries";
import { getUserFromLocalStorage } from "./utils/localStorageOperations";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Page404, LandingPage } from "./pages";
import {
    Feed,
    Login,
    Signup,
    NewPost,
    Profile,
    PostPage,
    Settings,
    Notifications,
    Explore,
} from "./features";
import { login } from "./features/user/userSlice";
import { loaded, getPosts } from "./features/posts/postsSlice";

function App() {
    const user = JSON.parse(getUserFromLocalStorage());
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const posts = useAppSelector(getPosts);

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
        },
        variables: {
            userId: user?._id ? user._id : "",
        },
    });

    useQuery(GET_POSTS, {
        onCompleted(data) {
            if (posts.length === 0) {
                dispatch(loaded(data.getPosts));
            }
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
                    path="/settings"
                    element={
                        <PrivateRoute path="/settings">
                            <Settings />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/explore"
                    element={
                        <PrivateRoute path="/explore">
                            <Explore />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <PrivateRoute path="/notifications">
                            <Notifications />
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
                <Route path="/post/:postId" element={<PostPage />} />
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
