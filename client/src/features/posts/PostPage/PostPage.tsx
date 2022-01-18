import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { InputEvent, FormEvent, Post as PostType } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { FlexContainer, Container } from "../../../components/Shared";
import {
    InputBox,
    ActionButton,
    Post,
    RenderComments,
} from "../../../components";
import { GET_POST } from "../../../graphql/queries";
import { ADD_COMMENT } from "../../../graphql/mutations";
import { loaded, getPosts } from "../postsSlice";
import { PageContainer } from "./style.postpage";
import { Page404 } from "../../../pages";
import { getUser } from "../../user/userSlice";

export function PostPage() {
    const [comment, setComment] = useState("");
    const [isError, setIsError] = useState(false);
    const [post, setPost] = useState<PostType>();
    const { pathname } = useLocation();
    const postId = pathname.split("/")[2];
    const COMMENT_LIMIT = 300;
    const user = useAppSelector(getUser);

    useQuery(GET_POST, {
        onCompleted(data) {
            if (!post) setPost(data.getPost);
        },
        onError() {
            setIsError(true);
        },
        variables: { postId },
    });

    const [addComment] = useMutation(ADD_COMMENT, {
        onCompleted(data) {
            if (post) {
                const updatedPost = {
                    ...post,
                    comments: [...post.comments, data.addComment],
                };
                setPost(updatedPost);
            }
        },
        onError() {
            toast.error("Some error occured while saving your comment", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        },
        variables: { body: comment, postId, userId: user._id },
    });

    if (isError) {
        return <Page404 />;
    }

    function postComment() {
        addComment();
        setComment("");
    }

    return (
        <PageContainer justify="center" mb="2em">
            <FlexContainer direction="column">
                {post && <Post post={post} key={post._id} />}
                <FlexContainer direction="column">
                    <Container fs="1.1rem">Comments</Container>
                    <FlexContainer align="center">
                        <InputBox
                            type="text"
                            placeholder="Write your comment here"
                            value={comment}
                            onChangeFunction={(e: InputEvent) =>
                                setComment(e.target.value)
                            }
                            color={
                                comment.length > COMMENT_LIMIT
                                    ? "var(--error-color)"
                                    : "initial"
                            }
                            w="100%"
                        />
                        <ActionButton
                            w="5em"
                            m="0.5em"
                            disabled={
                                !comment || comment.length > COMMENT_LIMIT
                            }
                            onClick={postComment}
                        >
                            Post
                        </ActionButton>
                    </FlexContainer>
                    {post?.comments && (
                        <Container mt="1em">
                            <RenderComments
                                comments={post?.comments}
                                post={post}
                                setPost={setPost}
                            />
                        </Container>
                    )}
                </FlexContainer>
            </FlexContainer>
        </PageContainer>
    );
}
