import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { FormEvent, InputEvent } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { FlexContainer, Container } from "../../../components/Shared";
import { InputBox, ActionButton } from "../../../components";
import { validatePassword } from "../../../utils/validatePassword";
import { SIGN_UP } from "../../../graphql/mutations";
import { login, getUser } from "../userSlice";

export function Signup() {
    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypedPassword, setRetypedPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const user = useAppSelector(getUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { state }: any = useLocation();
    const previousPath = state?.previousPath || "/";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (user?._id) {
            navigate("/", { replace: true });
        }
    }, [user]);

    function validateEmail(e: InputEvent) {
        const emailRegex = /\S+@\S+\.\S+/;
        setEmail(e.target.value);
        if (!emailRegex.test(e.target.value.toLowerCase())) {
            setErrorMessage("Enter a valid email address");
        } else {
            setErrorMessage("");
        }
    }

    const [addUser, { loading }] = useMutation(SIGN_UP, {
        onCompleted(data) {
            dispatch(login(data.signup));
            localStorage.setItem(
                "user",
                JSON.stringify({ _id: data.signup._id, jwt: data.signup.jwt })
            );
        },
        onError(error) {
            setErrorMessage(
                error.graphQLErrors[0].message ||
                    "Some error occurred please try again later"
            );
        },
        variables: { userName, password, email, name },
    });

    function signupAndRedirect(e: FormEvent) {
        e.preventDefault();
        if (!loading) {
            addUser();
        }
    }

    return (
        <FlexContainer
            align="center"
            justify="center"
            h="100vh"
            color="var(--font-color)"
            as="form"
            mt="1em"
            mb="2em"
            onSubmit={signupAndRedirect}
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
                    Signup
                </Container>
                <FlexContainer direction="column" w="100%" m="0.5em">
                    <InputBox
                        type="text"
                        label="Name"
                        onChangeFunction={(e: InputEvent) =>
                            setName(e.target.value)
                        }
                    />
                </FlexContainer>
                <FlexContainer direction="column" w="100%" m="0.5em">
                    <InputBox
                        type="text"
                        label="Username"
                        onChangeFunction={(e: InputEvent) => {
                            setErrorMessage("");
                            setUserName(e.target.value);
                        }}
                    />
                </FlexContainer>
                <FlexContainer direction="column" w="100%" m="0.5em">
                    <InputBox
                        type="email"
                        label="Email"
                        onChangeFunction={validateEmail}
                    />
                </FlexContainer>
                <FlexContainer direction="column" w="100%" m="0.5em">
                    <InputBox
                        type="password"
                        label="Password"
                        onChangeFunction={(e: InputEvent) =>
                            validatePassword(
                                e,
                                false,
                                setErrorMessage,
                                setRetypedPassword,
                                setPassword,
                                password
                            )
                        }
                    />
                </FlexContainer>
                <FlexContainer direction="column" w="100%" m="0.5em">
                    <InputBox
                        type="password"
                        label="Confirm Password"
                        onChangeFunction={(e: InputEvent) =>
                            validatePassword(
                                e,
                                true,
                                setErrorMessage,
                                setRetypedPassword,
                                setPassword,
                                password
                            )
                        }
                    />
                </FlexContainer>
                <Container color="var(--error-color)">{errorMessage}</Container>
                {name.trim() &&
                    userName.trim() &&
                    email &&
                    password &&
                    retypedPassword &&
                    !errorMessage && (
                        <ActionButton disabled={loading}>
                            {loading ? "Creating account..." : "Signup"}
                        </ActionButton>
                    )}
                <Container mt="0.5em">
                    <Container display="inline" mr="0.2em">
                        Already have an account?
                    </Container>
                    <Link
                        to="/login"
                        state={{ previousPath: `${previousPath}` }}
                    >
                        <Container
                            display="inline"
                            color="var(--secondary-color)"
                        >
                            Login
                        </Container>
                    </Link>
                </Container>
            </FlexContainer>
        </FlexContainer>
    );
}
