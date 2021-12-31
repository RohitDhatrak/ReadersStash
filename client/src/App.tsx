import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Post } from "./types";
import { GET_INITIAL_DATA } from "./graphql/queries";
import { getUserFromLocalStorage } from "./utils/localStorageOperations";
import { useAppDispatch } from "./app/hooks";
import { Login, Signup, Page404, LandingPage } from "./pages";
import { login } from "./features/user/userSlice";

function App() {
    const user = JSON.parse(getUserFromLocalStorage());
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { loading } = useQuery(GET_INITIAL_DATA, {
        onError(error) {
            if (error?.graphQLErrors[0].extensions.code === "UNAUTHENTICATED") {
                navigate("/");
                localStorage.setItem(
                    "user",
                    JSON.stringify({ _id: null, jwt: null })
                );
            }
        },
        onCompleted(data) {
            const { _id, userName, name, profilePicture, jwt } = data.getUser;
            dispatch(login(_id, userName, name, profilePicture, jwt));
        },
        variables: {
            userId: user?._id ? user._id : "",
        },
    });

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <Routes>
                <Route path="/" element={<LandingPage />} />
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
                theme="dark"
            />
        </div>
    );
}

export default App;
