import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FlexContainer, Container, Image } from "../Shared";
import { InputBox, ActionButton } from "../";
import { DeleteSvg, MoreSvg } from "../../assets/svg";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getUser } from "../../features/user/userSlice";
import { Comment, ButtonEvent, InputEvent } from "../../types";

interface RenderCommentsProps {
    comments: Array<Comment>;
}

export function RenderComments({ comments }: RenderCommentsProps) {
    const navigate = useNavigate();
    const user = useAppSelector(getUser);
    const [reply, setReply] = useState("");
    const [showDeleteMenu, setShowDeleteMenu] = useState("");
    const [replyInput, setReplyInput] = useState("");
    const REPLY_LIMIT = 300;

    // const [removePost] = useMutation(DELETE_POST, {
    //     onCompleted(data) {
    //         dispatch(remove(data.deletePost));
    //     },
    //     onError: raiseErrorToast("Some error occured could not delete post"),
    //     variables: { postId: post._id, userId: user._id },
    // });

    function visitProfile(e: ButtonEvent, userName: string) {
        e.stopPropagation();
        navigate(`/${userName}`);
    }

    function toggleShowMenu(comment: Comment) {
        if (showDeleteMenu) {
            setShowDeleteMenu("");
        } else {
            setShowDeleteMenu(comment._id);
        }
    }

    function toggleReply(comment: Comment) {
        if (replyInput) {
            setReplyInput("");
        } else {
            setReplyInput(comment._id);
        }
    }

    function postReply() {}

    function deleteComment() {}

    return (
        <>
            {comments.map((comment) => (
                <Container key={comment._id}>
                    <FlexContainer
                        direction="row"
                        w="40em"
                        maxW="90vw"
                        mt="1.5em"
                    >
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
                                    {comment.user.name}
                                </Container>
                                <Container
                                    ml="0.4em"
                                    color="var(--font-color-2)"
                                >
                                    @{comment.user.userName}
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
                                <Container
                                    cursor="pointer"
                                    onClick={() => toggleReply(comment)}
                                >
                                    {replyInput ? "Close" : "Reply"}
                                </Container>
                                {comment.user.userName === user.userName && (
                                    <Container ml="1em" cursor="pointer">
                                        Delete
                                    </Container>
                                )}
                            </FlexContainer>
                        </Container>
                    </FlexContainer>
                    {replyInput === comment._id && (
                        <FlexContainer w="40em" maxW="90vw" ml="3.5em">
                            <InputBox
                                type="text"
                                placeholder="Write your comment here"
                                onChangeFunction={(e: InputEvent) =>
                                    setReply(e.target.value)
                                }
                                color={
                                    reply.length > REPLY_LIMIT
                                        ? "var(--error-color)"
                                        : "initial"
                                }
                                w="80%"
                            />
                            {!!reply && (
                                <ActionButton
                                    w="5em"
                                    m="0.5em"
                                    disabled={reply.length > REPLY_LIMIT}
                                    onClick={postReply}
                                >
                                    Post
                                </ActionButton>
                            )}
                        </FlexContainer>
                    )}
                    <Container pl="2em">
                        {comment?.replies &&
                            RenderComments({
                                comments: comment.replies,
                            })}
                    </Container>
                </Container>
            ))}
        </>
    );
}
