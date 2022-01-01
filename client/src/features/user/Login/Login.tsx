import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { InputEvent, FormEvent } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { FlexContainer, Container } from "../../../components/Shared";
import { InputBox, ActionButton } from "../../../components";
import { LOGIN } from "../../../graphql/mutations";
import { login, getUser } from "../userSlice";

export function Login() {
    const [userName, setUserName] = useState(
        process.env.REACT_APP_GUEST_USERNAME
    );
    const [password, setPassword] = useState(
        process.env.REACT_APP_GUEST_PASSWORD
    );
    const [errorMessage, setErrorMessage] = useState("");
    const [asGuest, setAsGuest] = useState(true);
    const user = useAppSelector(getUser);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { state }: any = useLocation();
    const previousPath = state?.previousPath || "/";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (user?._id) {
            navigate(previousPath, { replace: true });
        }
    }, [user]);

    function updatePassword(e: InputEvent) {
        setErrorMessage("");
        setPassword(e.target.value);
        setAsGuest(false);
    }

    function updateUserName(e: InputEvent) {
        setErrorMessage("");
        setUserName(e.target.value);
    }

    const [loginUser] = useMutation(LOGIN, {
        onCompleted(data) {
            const { _id, userName, name, profilePicture, jwt } = data.login;
            dispatch(login(_id, userName, name, profilePicture, jwt));
            localStorage.setItem("user", JSON.stringify({ _id, jwt }));
        },
        onError(error) {
            setErrorMessage(
                error.graphQLErrors[0].message ||
                    "Some error occurred please try again later"
            );
        },
        variables: { userName, password },
    });

    function loginAndRedirect(e: FormEvent) {
        e.preventDefault();
        loginUser();
    }

    return (
        <FlexContainer
            align="center"
            justify="center"
            h="80vh"
            color="var(--font-color)"
            as="form"
            onSubmit={loginAndRedirect}
        >
            <FlexContainer
                direction="column"
                align="center"
                justify="center"
                b="1px solid var(--border-color)"
                w="30em"
                m="0 auto"
                p="2em"
                br="1em"
                maxW="85vw"
            >
                <Container mb="1em" fs="2rem" color="var(--secondary-color)">
                    Login
                </Container>
                <FlexContainer direction="column" w="100%" m="0.5em">
                    <InputBox
                        type="text"
                        label="Username"
                        onChangeFunction={updateUserName}
                    />
                </FlexContainer>
                <FlexContainer direction="column" w="100%" m="0.5em">
                    <InputBox
                        type="password"
                        label="Password"
                        onChangeFunction={updatePassword}
                    />
                </FlexContainer>
                <Container color="var(--error-color)">{errorMessage}</Container>
                {asGuest && <Container mb="1em">OR</Container>}
                {userName && password && !errorMessage && !asGuest && (
                    <ActionButton>Login</ActionButton>
                )}
                {asGuest && <ActionButton>Login as Guest</ActionButton>}
                <Container mt="0.5em">
                    <Container display="inline" mr="0.2em">
                        Don't have an account yet?
                    </Container>
                    <Link
                        to="/signup"
                        state={{ previousPath: `${previousPath}` }}
                    >
                        <Container
                            display="inline"
                            color="var(--secondary-color)"
                        >
                            Signup
                        </Container>
                    </Link>
                </Container>
            </FlexContainer>
        </FlexContainer>
    );
}
