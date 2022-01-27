import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import TexareaAutosize from "react-textarea-autosize";
import {
    InputEvent,
    ButtonEvent,
    TextAreaEvent,
    Post as PostType,
} from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
    FlexContainer,
    Container,
    Input,
    Image,
} from "../../../components/Shared";
import { ADD_POST } from "../../../graphql/mutations";
import { added } from "../postsSlice";
import { getUser } from "../../user/userSlice";
import { AddImageSvg, CloseSvg } from "../../../assets/svg";
import { PageContainer } from "./style.newpost";

export function NewPost() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState<string | ArrayBuffer | null>();
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const navigate = useNavigate();
    const TITLE_LIMIT = 127;
    const BODY_LIMIT = 600;

    function handleInput(e: InputEvent | TextAreaEvent, type: string) {
        if (type === "title") {
            setTitle(e.target.value);
        } else if (type === "body") {
            setBody(e.target.value);
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

    let [addPost, { loading: loadingAddPost }] = useMutation(ADD_POST, {
        onCompleted(data) {
            dispatch(added(data.createPost));
            toast.success("Post added successfully", {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setTitle("");
            setBody("");
            setImage("");
            loadingAddPost = false;
        },
        onError() {
            toast.error("Some error occured please try again later", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            loadingAddPost = false;
        },
        variables: { body, title, image, userId: user._id },
    });

    function handlePost(e: ButtonEvent) {
        if (!loadingAddPost) addPost();
    }

    return (
        <PageContainer
            align="center"
            justify="center"
            direction="column"
            mb="2em"
        >
            <FlexContainer
                bgc="var(--card-color)"
                color="var(--font-color-2)"
                direction="column"
                w="30em"
                maxW="90vw"
                br="1em"
            >
                {!image && (
                    <FlexContainer
                        w="100%"
                        justify="center"
                        mt="2em"
                        className="inputWrapper"
                    >
                        <AddImageSvg
                            color="var(--font-color-2)"
                            className="scale-13"
                        />
                        <Input
                            type="file"
                            className="fileInput"
                            onChange={handleImageSelection}
                        />
                        <Container ml="0.5em">Add Image</Container>
                    </FlexContainer>
                )}

                {image && (
                    <Container h="12em" mb="1em" position="relative">
                        <FlexContainer
                            position="absolute"
                            right="1em"
                            top="1em"
                            cursor="pointer"
                            p="0.3em"
                            bgc="#fff"
                            align="center"
                            br="50%"
                            onClick={() => setImage(null)}
                        >
                            <CloseSvg />
                        </FlexContainer>
                        <Image
                            src={image}
                            h="100%"
                            w="100%"
                            objectFit="cover"
                            br="1em 1em 0 0"
                        />
                    </Container>
                )}

                <Container p="1em 2em" pt="0">
                    <Container
                        as="input"
                        className="post-title"
                        placeholder="Title of the idea"
                        w="100%"
                        b="none"
                        fs="1.5rem"
                        m="0.5em 0"
                        fw={600}
                        onChange={(e: InputEvent) => handleInput(e, "title")}
                        value={title}
                        color={
                            title.length > TITLE_LIMIT
                                ? "var(--error-color)"
                                : "initial"
                        }
                    />
                    <TexareaAutosize
                        className="post-body"
                        minRows={8}
                        placeholder="What inspiring idea you want to share with the world today?"
                        onChange={(e: TextAreaEvent) => handleInput(e, "body")}
                        value={body}
                    />
                    <Container
                        color={
                            body.length > BODY_LIMIT
                                ? "var(--error-color)"
                                : "inherit"
                        }
                    >
                        {600 - body.length}
                    </Container>
                </Container>
            </FlexContainer>
            <Container
                as="button"
                mt="1em"
                bgc="var(--card-color)"
                p="1em 2em"
                br="2em"
                b="none"
                fs="1rem"
                cursor="pointer"
                disabled={
                    body.length > BODY_LIMIT ||
                    title.length > TITLE_LIMIT ||
                    !body.trim() ||
                    !title.trim() ||
                    loadingAddPost
                }
                onClick={handlePost}
            >
                {loadingAddPost ? "Posting..." : "Post"}
            </Container>
        </PageContainer>
    );
}
