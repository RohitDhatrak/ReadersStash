import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
    PrivateRoute,
    Header,
    SidePannel,
    SidePannelMinimal,
    MobileNav,
} from "./components";
import { Container, FlexContainer } from "./components/Shared";
import {
    GET_INITIAL_DATA,
    GET_POSTS,
    GET_NOTIFICATIONS,
} from "./graphql/queries";
import { getUserFromLocalStorage } from "./utils/localStorageOperations";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Page404, LandingPage, Search, Notifications } from "./pages";
import {
    Feed,
    Login,
    Signup,
    NewPost,
    Profile,
    PostPage,
    Settings,
    Explore,
    Following,
    Followers,
    Likes,
} from "./features";
import { login } from "./features/user/userSlice";
import { loaded, getPosts } from "./features/posts/postsSlice";
import { LoaderSvg } from "./assets/svg";
import { Notification } from "./types";

function App() {
    const user = JSON.parse(getUserFromLocalStorage());
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [notificationLoading, setNotificationLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<Array<Notification>>([]);
    const posts = useAppSelector(getPosts);

    const { refetch } = useQuery(GET_INITIAL_DATA, {
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

    useEffect(() => {
        refetch();
        window.scrollTo(0, 0);
    }, []);

    useQuery(GET_POSTS, {
        onCompleted(data) {
            if (posts.length === 0) {
                dispatch(loaded(data.getPosts));
            }
        },
    });

    useQuery(GET_NOTIFICATIONS, {
        onCompleted(data) {
            if (
                data.getNotifications.length !== notifications.length &&
                data.getNotifications.length > 0
            ) {
                setNotifications(data.getNotifications);
                let count = 0;
                for (const notification of data.getNotifications) {
                    if (!notification.isRead) count++;
                    else break;
                }
                setUnreadCount(count);
            }
            setNotificationLoading(false);
        },
        variables: {
            userId: user._id,
            count: notifications.length,
        },
        pollInterval: 5000,
    });

    if (isLoading)
        return (
            <FlexContainer h="100vh" justify="center" align="center">
                <LoaderSvg />
            </FlexContainer>
        );

    return (
        <Container>
            <Header />
            <SidePannel unreadCount={unreadCount} />
            <SidePannelMinimal unreadCount={unreadCount} />
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
                            <Notifications
                                notifications={notifications}
                                notificationLoading={notificationLoading}
                                setNotifications={setNotifications}
                                setUnreadCount={setUnreadCount}
                            />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/following"
                    element={
                        <PrivateRoute path="/following">
                            <Following />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/followers"
                    element={
                        <PrivateRoute path="/followers">
                            <Followers />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/likes"
                    element={
                        <PrivateRoute path="/likes">
                            <Likes />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/search"
                    element={
                        <PrivateRoute path="/search">
                            <Search />
                        </PrivateRoute>
                    }
                />
                <Route path="/:userName" element={<Profile />} />
                <Route path="/post/:postId" element={<PostPage />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
            <MobileNav unreadCount={unreadCount} />
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
