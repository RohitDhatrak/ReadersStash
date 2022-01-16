import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FlexContainer, Container, Image } from "../Shared";
import { DeleteSvg, MoreSvg } from "../../assets/svg";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getUser } from "../../features/user/userSlice";
import { Comment, ButtonEvent } from "../../types";

interface RenderCommentsProps {
    comments: Array<Comment>;
}

export function RenderComments({ comments }: RenderCommentsProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const [showDeleteMenu, setShowDeleteMenu] = useState("");

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

    function deleteComment() {}

    return (
        <>
            {comments.map((comment) => (
                <FlexContainer>
                    <FlexContainer
                        p="1em 2em"
                        align="center"
                        justify="space-between"
                    >
                        <FlexContainer align="center">
                            <Image
                                src={comment.user.profilePicture}
                                h="3em"
                                br="50%"
                                cursor="pointer"
                                onClick={(e: ButtonEvent) =>
                                    visitProfile(e, comment.user.userName)
                                }
                            />
                            <FlexContainer
                                direction="column"
                                ml="0.5em"
                                justify="space-between"
                            >
                                <Container
                                    cursor="pointer"
                                    onClick={(e: ButtonEvent) =>
                                        visitProfile(e, comment.user.userName)
                                    }
                                >
                                    {comment.user.name}
                                </Container>
                                <Container
                                    color="var(--font-color-2)"
                                    cursor="pointer"
                                    onClick={(e: ButtonEvent) =>
                                        visitProfile(e, comment.user.userName)
                                    }
                                >
                                    @{comment.user.userName}
                                </Container>
                            </FlexContainer>
                        </FlexContainer>
                        {comment.user._id === user._id && (
                            <FlexContainer
                                onClick={() => toggleShowMenu(comment)}
                                cursor="pointer"
                                position="relative"
                            >
                                <FlexContainer
                                    align="center"
                                    justify="center"
                                    br="50%"
                                    p="0.5em 0.55em"
                                    hover="background-color: var(--nav-hover-color)"
                                >
                                    <MoreSvg className="scale-14" />
                                </FlexContainer>
                                {showDeleteMenu && (
                                    <FlexContainer
                                        position="absolute"
                                        right="2.3em"
                                        bgc="var(--bg-color)"
                                        p="0.8em 1em"
                                        br="1em"
                                        onClick={deleteComment}
                                    >
                                        <DeleteSvg
                                            className="scale-14"
                                            color="var(--error-color)"
                                        />
                                        <Container
                                            color="var(--error-color)"
                                            ml="0.5em"
                                        >
                                            Delete
                                        </Container>
                                    </FlexContainer>
                                )}
                            </FlexContainer>
                        )}
                    </FlexContainer>
                    <Container key={comment._id}>
                        <Container pl="2em">
                            {comment.replies &&
                                RenderComments({ comments: comment.replies })}
                        </Container>
                    </Container>
                </FlexContainer>
            ))}
        </>
    );
}
