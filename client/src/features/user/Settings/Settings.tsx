import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { useMediaQuery } from "react-responsive";
import {
    InputEvent,
    FormEvent,
    Post as PostType,
    User,
    TextAreaEvent,
    ButtonEvent,
} from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
    FlexContainer,
    Container,
    Image,
    Input,
} from "../../../components/Shared";
import { InputBox, ActionButton, Post } from "../../../components";
import { GET_PROFILE_DATA } from "../../../graphql/queries";
import { CHANGE_PASSWORD, UPDATE_PROFILE } from "../../../graphql/mutations";
import { profileLoaded, getUser, followed, unfollowed } from "../userSlice";
import { Page404 } from "../../../pages";
import { LikeSvg, CloseSvg, EditSvg } from "../../../assets/svg";
import { raiseErrorToast } from "../../../utils/toast";
import { validatePassword } from "../../../utils/validatePassword";
import { ImageContainer, PageContainer } from "./style.settings";

export function Settings() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio);
    const [email, setEmail] = useState(user.email);
    const [url, setUrl] = useState(user.url);
    const [image, setImage] = useState<string | ArrayBuffer | null>(
        user.profilePicture
    );
    const [profileMessage, setProfileMessage] = useState("");
    const [profileError, setProfileError] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useQuery(GET_PROFILE_DATA, {
        onCompleted(data) {
            if (!data?.email) {
                setEmail(data.getUser.email);
                setName(data.getUser.name);
                setImage(data.getUser.profilePicture);
                setBio(data.getUser.bio);
                setUrl(data.getUser.url);
                dispatch(profileLoaded(data.getUser));
            }
        },
        variables: { userName: user.userName },
    });

    const [changePassword, { loading: passwordLoading }] = useMutation(
        CHANGE_PASSWORD,
        {
            onCompleted() {
                setPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setMessage("Password changed successfully");
            },
            onError(error) {
                setError(
                    error.graphQLErrors[0].message ||
                        "Some error occurred please try again later"
                );
            },
            variables: { userId: user._id, password, newPassword },
        }
    );

    let [changeProfileData, { loading: profileLoading }] = useMutation(
        UPDATE_PROFILE,
        {
            onCompleted(data) {
                setEmail(data.updateProfile.email);
                setName(data.updateProfile.name);
                setImage(data.updateProfile.profilePicture);
                setBio(data.updateProfile.bio);
                setUrl(data.updateProfile.url);
                dispatch(profileLoaded(data.getUser));
                setProfileMessage("Profile updated successfully");
                profileLoading = false;
            },
            onError: raiseErrorToast(
                "Some error occured while updating your profile please try again later"
            ),
            variables: {
                userId: user._id,
                email,
                name,
                profilePicture: image,
                bio,
                url,
            },
        }
    );

    async function verifyAndSetNewPassword(e: FormEvent) {
        e.preventDefault();
        if (!passwordLoading) changePassword();
    }

    function logOut() {
        navigate("/landing");
        localStorage.setItem("user", JSON.stringify({ _id: null, jwt: null }));
    }

    function validateEmail(e: InputEvent) {
        const emailRegex = /\S+@\S+\.\S+/;
        setEmail(e.target.value);
        if (!emailRegex.test(e.target.value.toLowerCase())) {
            setProfileError("Enter a valid email address");
        } else {
            setProfileError("");
        }
    }

    function handleImageSelection(e: InputEvent) {
        if (e.currentTarget && e.currentTarget.files) {
            const file = e.currentTarget.files[0];
            previewFile(file);
        }
    }

    function previewFile(file: File) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImage(reader.result);
        };
    }

    function removePhoto(e: ButtonEvent) {
        if (image !== user.profilePicture) {
            setImage(user.profilePicture);
        }
    }

    function updateProfile(e: FormEvent) {
        e.preventDefault();
        if (!profileLoading) {
            setProfileMessage("");
            changeProfileData();
        }
    }

    return (
        <PageContainer>
            <FlexContainer
                m="0 auto"
                direction="column"
                maxW="80vw"
                w="20em"
                mb="5em"
            >
                <Container fs="1.2rem" m="1.5em 0">
                    Profile
                </Container>
                <ImageContainer position="relative" cursor="pointer">
                    <Image
                        src={image}
                        w="100%"
                        h="100%"
                        br="50%"
                        objectFit="cover"
                    />
                    <FlexContainer
                        bgc="#fff"
                        br="50%"
                        position="absolute"
                        bottom="0.5rem"
                        p="0.5em"
                        align="center"
                        onClick={removePhoto}
                    >
                        {image === user.profilePicture && (
                            <EditSvg color="var(--font-color)" />
                        )}
                        {image !== user.profilePicture && (
                            <CloseSvg color="var(--font-color)" />
                        )}
                    </FlexContainer>
                    {image === user.profilePicture && (
                        <Input
                            type="file"
                            w="100%"
                            className="fileInput"
                            onChange={handleImageSelection}
                        />
                    )}
                </ImageContainer>
                <FlexContainer
                    direction="column"
                    ml="1em"
                    as="form"
                    onSubmit={updateProfile}
                >
                    <InputBox
                        type="text"
                        label="Name"
                        value={name}
                        onChangeFunction={(e: InputEvent) =>
                            setName(e.target.value)
                        }
                    />
                    <InputBox
                        type="email"
                        label="Email"
                        value={email}
                        onChangeFunction={validateEmail}
                    />

                    <Container as="label" htmlFor="bio">
                        Bio
                    </Container>
                    <Container
                        as="textarea"
                        id="bio"
                        placeholder="What inspiring idea you want to share with the world today?"
                        fs="1rem"
                        minH="7em"
                        bgc="transparent"
                        b="1px solid var(--border-color)"
                        p="1em"
                        br="0.4em"
                        m="0.5em auto"
                        w="95%"
                        onChange={(e: TextAreaEvent) => setBio(e.target.value)}
                        value={bio}
                    />
                    <InputBox
                        type="text"
                        label="URL"
                        value={url}
                        onChangeFunction={(e: InputEvent) =>
                            setUrl(e.target.value)
                        }
                    />
                    <Container m="0.5em auto" textAlign="center">
                        <Container color="var(--success-color)">
                            {profileMessage}
                        </Container>
                        <Container color="var(--error-color)">
                            {profileError}
                        </Container>
                    </Container>
                    {!profileError && (
                        <ActionButton w="unset" disabled={profileLoading}>
                            {profileLoading ? "Updating..." : "Update Profile"}
                        </ActionButton>
                    )}
                </FlexContainer>
                <Container fs="1.2rem" m="1.5em 0">
                    Password
                </Container>
                <FlexContainer
                    direction="column"
                    ml="1em"
                    as="form"
                    onSubmit={verifyAndSetNewPassword}
                >
                    <InputBox
                        type="password"
                        label="Old Password"
                        value={password}
                        onChangeFunction={(e: InputEvent) => {
                            setError("");
                            setPassword(e.target.value);
                        }}
                    />
                    <InputBox
                        type="password"
                        label="New Password"
                        value={newPassword}
                        onChangeFunction={(e: InputEvent) => {
                            validatePassword(
                                e,
                                false,
                                setError,
                                setConfirmPassword,
                                setNewPassword,
                                newPassword
                            );
                            setNewPassword(e.target.value);
                        }}
                    />
                    <InputBox
                        type="password"
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeFunction={(e: InputEvent) => {
                            validatePassword(
                                e,
                                true,
                                setError,
                                setConfirmPassword,
                                setNewPassword,
                                newPassword
                            );
                            setConfirmPassword(e.target.value);
                        }}
                    />
                    <Container m="0.5em auto" textAlign="center">
                        <Container color="var(--success-color)">
                            {message}
                        </Container>
                        <Container color="var(--error-color)">
                            {error}
                        </Container>
                    </Container>
                    {!error && password && newPassword && confirmPassword && (
                        <ActionButton w="unset">Change Password</ActionButton>
                    )}
                </FlexContainer>
                <Container fs="1.2rem" m="1.5em 0">
                    Logout
                </Container>
                <FlexContainer direction="column" ml="1em" fs="1rem">
                    <Container
                        as="button"
                        fs="1rem"
                        h="2.5em"
                        br="0.4em"
                        b="none"
                        bgc="var(--error-color)"
                        cursor="pointer"
                        fw={600}
                        onClick={logOut}
                    >
                        Logout
                    </Container>
                </FlexContainer>
            </FlexContainer>
        </PageContainer>
    );
}
