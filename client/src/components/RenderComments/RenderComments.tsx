import { useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FlexContainer, Container, Image } from "../Shared";
import { InputBox, ActionButton } from "../";
import { DeleteSvg, MoreSvg } from "../../assets/svg";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getUser } from "../../features/user/userSlice";
import { Comment, ButtonEvent, InputEvent, Post } from "../../types";
import { ADD_COMMENT, DELETE_COMMENT } from "../../graphql/mutations";
import { raiseErrorToast, raiseToast } from "../../utils/toast";

interface RenderCommentsProps {
    comments: Array<Comment>;
    post: Post;
    setPost: Function;
}

export function RenderComments({
    comments,
    post,
    setPost,
}: RenderCommentsProps) {
    const navigate = useNavigate();
    const user = useAppSelector(getUser);
    const [reply, setReply] = useState("");
    const [replyInput, setReplyInput] = useState("");
    const REPLY_LIMIT = 300;

    const [addReply] = useMutation(ADD_COMMENT, {
        onCompleted(data) {
            if (post) {
                const updatedPost = {
                    ...post,
                    comments: post.comments.map((comment) =>
                        comment._id === data.addComment._id
                            ? data.addComment
                            : comment
                    ),
                };
                setPost(updatedPost);
            }
        },
        onError: raiseErrorToast(
            "Some error occured while saving your comment"
        ),
    });

    const [deleteReply] = useMutation(DELETE_COMMENT, {
        onCompleted(data) {
            if (post) {
                const updatedPost = {
                    ...post,
                    comments: post.comments.map((comment) =>
                        comment._id === data.deleteComment._id
                            ? data.deleteComment
                            : comment
                    ),
                };
                setPost(updatedPost);
            }
        },
        onError: raiseErrorToast(
            "Some error occured while deleteing your comment"
        ),
    });

    const [deleteRootComment] = useMutation(DELETE_COMMENT, {
        onCompleted(data) {
            if (post) {
                const updatedPost = {
                    ...post,
                    comments: post.comments.filter(
                        (comment) => comment._id !== data.deleteComment._id
                    ),
                };
                setPost(updatedPost);
            }
        },
        onError: raiseErrorToast(
            "Some error occured while deleteing your comment"
        ),
    });

    function visitProfile(e: ButtonEvent, userName: string) {
        e.stopPropagation();
        navigate(`/${userName}`);
    }

    function toggleReply(comment: Comment) {
        if (replyInput) {
            setReplyInput("");
        } else {
            setReplyInput(comment._id);
        }
    }

    function postReply(comment: Comment) {
        addReply({
            variables: {
                body: reply,
                postId: post._id,
                userId: user._id,
                parentCommentId: comment._id,
            },
        });
        setReply("");
        setReplyInput("");
    }

    function deleteComment(comment: Comment) {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this comment?"
        );
        if (isConfirmed) {
            if (comment?.parentComment) {
                deleteReply({
                    variables: {
                        commentId: comment._id,
                        postId: post._id,
                        parentCommentId: comment.parentComment,
                    },
                });
            } else {
                deleteRootComment({
                    variables: {
                        commentId: comment._id,
                        postId: post._id,
                    },
                });
            }
        }
    }

    return (
        <>
            {comments.map((comment) => (
                <Container key={comment._id} w="40em" maxW="90vw">
                    <FlexContainer direction="row" mt="1.5em">
                        <Image
                            src={comment.user?.profilePicture}
                            h="3em"
                            br="50%"
                            cursor="pointer"
                            onClick={(e: ButtonEvent) =>
                                visitProfile(e, comment.user?.userName)
                            }
                        />
                        <Container ml="1em">
                            <FlexContainer
                                mb="0.3em"
                                cursor="pointer"
                                onClick={(e: ButtonEvent) =>
                                    visitProfile(e, comment.user?.userName)
                                }
                            >
                                <Container fw={600}>
                                    {comment?.user?.name}
                                </Container>
                                <Container
                                    ml="0.4em"
                                    color="var(--font-color-2)"
                                >
                                    @{comment?.user?.userName}
                                </Container>
                            </FlexContainer>
                            <Container whiteSpace="pre-wrap">
                                {comment.body}
                            </Container>
                            <FlexContainer
                                mt="0.5em"
                                fs="0.9rem"
                                color="var(--font-color-2)"
                            >
                                {comment.level === 1 && (
                                    <Container
                                        mr="1em"
                                        cursor="pointer"
                                        onClick={() => toggleReply(comment)}
                                    >
                                        {replyInput ? "Close" : "Reply"}
                                    </Container>
                                )}
                                {comment?.user?.userName === user?.userName && (
                                    <Container
                                        cursor="pointer"
                                        onClick={() => deleteComment(comment)}
                                    >
                                        Delete
                                    </Container>
                                )}
                            </FlexContainer>
                        </Container>
                    </FlexContainer>
                    {replyInput === comment._id && (
                        <FlexContainer ml="3.5em" align="center">
                            <InputBox
                                type="text"
                                placeholder="Write your comment here"
                                value={reply}
                                onChangeFunction={(e: InputEvent) =>
                                    setReply(e.target.value)
                                }
                                color={
                                    reply.length > REPLY_LIMIT
                                        ? "var(--error-color)"
                                        : "initial"
                                }
                                w="100%"
                            />
                            <ActionButton
                                w="5em"
                                disabled={!reply || reply.length > REPLY_LIMIT}
                                onClick={() => postReply(comment)}
                            >
                                Post
                            </ActionButton>
                        </FlexContainer>
                    )}
                    <Container pl="4em">
                        {comment?.replies && (
                            <RenderComments
                                comments={comment?.replies}
                                post={post}
                                setPost={setPost}
                            />
                        )}
                    </Container>
                </Container>
            ))}
        </>
    );
}
