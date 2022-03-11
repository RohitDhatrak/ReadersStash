import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { FlexContainer, Container } from "../Shared";
import { InputBox, ActionButton } from "../";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getUser } from "../../features/user/userSlice";
import { commentDeleted } from "../../features/posts/postsSlice";
import { Comment, ButtonEvent, InputEvent, Post } from "../../types";
import { ADD_COMMENT, DELETE_COMMENT } from "../../graphql/mutations";
import { raiseErrorToast } from "../../utils/toast";
import { ImageContainer, ImageDiv } from "./style.renderComments";

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
    const dispatch = useAppDispatch();
    const [reply, setReply] = useState("");
    const [deletingId, setDeletingId] = useState("");
    const [replyInput, setReplyInput] = useState("");
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });

    const REPLY_LIMIT = 300;

    let [addReply, { loading: loadingAddComment }] = useMutation(ADD_COMMENT, {
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
                setReply("");
                setReplyInput("");
                setPost(updatedPost);
            }
            loadingAddComment = false;
        },
        onError: raiseErrorToast(
            "Some error occured while saving your comment"
        ),
    });

    let [deleteReply, { loading: loadingDeleteReply }] = useMutation(
        DELETE_COMMENT,
        {
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
                loadingDeleteReply = false;
                setDeletingId("");
            },
            onError: raiseErrorToast(
                "Some error occured while deleteing your comment"
            ),
        }
    );

    let [deleteRootComment, { loading: loadingDeleteComment }] = useMutation(
        DELETE_COMMENT,
        {
            onCompleted(data) {
                if (post) {
                    const updatedPost = {
                        ...post,
                        comments: post.comments.filter(
                            (comment) => comment._id !== data.deleteComment._id
                        ),
                        commentsCount: post.commentsCount - 1,
                    };
                    dispatch(commentDeleted(updatedPost));
                    setPost(updatedPost);
                }
                loadingDeleteComment = false;
                setDeletingId("");
            },
            onError: raiseErrorToast(
                "Some error occured while deleteing your comment"
            ),
        }
    );

    function visitProfile(e: ButtonEvent, userName: string) {
        e.stopPropagation();
        navigate(`/${userName}`);
    }

    function toggleReply(comment: Comment) {
        if (!loadingAddComment) {
            if (replyInput === comment._id) {
                setReplyInput("");
            } else {
                setReplyInput(comment._id);
            }
        }
    }

    function postReply(comment: Comment) {
        if (!loadingAddComment) {
            addReply({
                variables: {
                    body: reply,
                    postId: post._id,
                    userId: user._id,
                    parentCommentId: comment._id,
                },
            });
        }
    }

    function deleteComment(comment: Comment) {
        if (!loadingDeleteReply && !loadingDeleteComment) {
            const isConfirmed = window.confirm(
                "Are you sure you want to delete this comment?"
            );
            if (isConfirmed) {
                setDeletingId(comment._id);
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
    }

    return (
        <>
            {comments.map((comment) => (
                <Container
                    id={`${comment._id}`}
                    key={comment._id}
                    w="40em"
                    maxW="85vw"
                >
                    <FlexContainer direction="row" mt="1.5em">
                        <ImageContainer
                            cursor="pointer"
                            onClick={(e: ButtonEvent) =>
                                visitProfile(e, comment.user?.userName)
                            }
                        >
                            <ImageDiv
                                bgImg={`url(${comment.user?.profilePicture})`}
                            />
                        </ImageContainer>
                        <Container ml="1em">
                            <FlexContainer
                                mb="0.3em"
                                direction="column"
                                cursor="pointer"
                                align="flex-start"
                                onClick={(e: ButtonEvent) =>
                                    visitProfile(e, comment.user?.userName)
                                }
                            >
                                <Container
                                    fw={600}
                                    as="button"
                                    b="none"
                                    bgc="transparent"
                                    fs="1rem"
                                    p="0"
                                    cursor="pointer"
                                >
                                    {comment?.user?.name}
                                </Container>
                                <Container color="var(--font-color-2)">
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
                                {comment.level === 1 && user?._id && (
                                    <Container
                                        as="button"
                                        mr="1em"
                                        cursor="pointer"
                                        b="none"
                                        bgc="transparent"
                                        p="0"
                                        fs="0.9rem"
                                        color="var(--font-color-2)"
                                        onClick={() => toggleReply(comment)}
                                    >
                                        {replyInput === comment._id
                                            ? "Close"
                                            : "Reply"}
                                    </Container>
                                )}
                                {comment?.user?.userName === user?.userName && (
                                    <Container
                                        as="button"
                                        cursor={
                                            deletingId &&
                                            deletingId !== comment._id
                                                ? "default"
                                                : "pointer"
                                        }
                                        b="none"
                                        bgc="transparent"
                                        p="0"
                                        fs="0.9rem"
                                        color="var(--font-color-2)"
                                        onClick={() => deleteComment(comment)}
                                        opacity={
                                            deletingId &&
                                            deletingId !== comment._id
                                                ? 0.5
                                                : 1
                                        }
                                    >
                                        {deletingId === comment._id
                                            ? "Deleteing..."
                                            : "Delete"}
                                    </Container>
                                )}
                            </FlexContainer>
                        </Container>
                    </FlexContainer>
                    {replyInput === comment._id && !!user?._id && (
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
                                disabled={
                                    !reply.trim() ||
                                    reply.length > REPLY_LIMIT ||
                                    loadingAddComment
                                }
                                onClick={() => postReply(comment)}
                            >
                                {loadingAddComment ? "Posting..." : "Post"}
                            </ActionButton>
                        </FlexContainer>
                    )}
                    <Container pl={isTabletOrMobile ? "1em" : "2em"}>
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
