import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { raiseErrorToast, raiseToast } from "../../utils/toast";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { FlexContainer, Container, Image } from "../../components/Shared";
import { Post as PostType, ButtonEvent } from "../../types";
import {
    LikeSvg,
    CommentSvg,
    BookmarkSvg,
    BookmarkFilledSvg,
    ShareSvg,
    MoreSvg,
    DeleteSvg,
} from "../../assets/svg";
import {
    LIKE_POST,
    UNLIKE_POST,
    BOOKMARK,
    REMOVE_BOOKMARK,
    DELETE_POST,
} from "../../graphql/mutations";
import { liked, unliked, remove } from "../../features/posts/postsSlice";
import {
    getUser,
    bookmark,
    removeBookmark,
} from "../../features/user/userSlice";
import { ImageContainer, ImageDiv } from "./style.post";

export function Post({ post }: { post: PostType }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const user = useAppSelector(getUser);
    const [showDeleteMenu, setShowDeleteMenu] = useState("");
    const isPostPage = pathname.includes("/post/");

    const [likePost, { loading: likeLoading }] = useMutation(LIKE_POST, {
        onCompleted(data) {
            dispatch(liked(data.likePost));
        },
        onError: raiseErrorToast("Some error occured please try again later"),
        variables: { postId: post._id, userId: user._id },
    });

    const [unlikePost, { loading: unlikeLoading }] = useMutation(UNLIKE_POST, {
        onCompleted(data) {
            dispatch(unliked(data.unlikePost));
        },
        onError: raiseErrorToast("Some error occured please try again later"),
        variables: { postId: post._id, userId: user._id },
    });

    const [bookmarkPost, { loading: bookmarkLoading }] = useMutation(BOOKMARK, {
        onCompleted(data) {
            dispatch(bookmark(data.bookmark));
        },
        onError: raiseErrorToast("Some error occured please try again later"),
        variables: { postId: post._id, userId: user._id },
    });

    const [removePostBookmark, { loading: removeBookmarkLoading }] =
        useMutation(REMOVE_BOOKMARK, {
            onCompleted(data) {
                dispatch(removeBookmark(data.removeBookmark));
            },
            onError: raiseErrorToast(
                "Some error occured please try again later"
            ),
            variables: { postId: post._id, userId: user._id },
        });

    const [removePost, { loading: loadingDeletePost }] = useMutation(
        DELETE_POST,
        {
            onCompleted(data) {
                dispatch(remove(data.deletePost));
            },
            onError: raiseErrorToast(
                "Some error occured could not delete post"
            ),
            variables: { postId: post._id, userId: user._id },
        }
    );

    function toggleLike(e: ButtonEvent) {
        e.stopPropagation();
        if (!likeLoading && !unlikeLoading) {
            if (user.likesHashMap[post._id]) {
                unlikePost();
            } else {
                likePost();
            }
        }
    }

    function toggleBookmark(e: ButtonEvent) {
        e.stopPropagation();
        if (!bookmarkLoading && !removeBookmarkLoading) {
            if (user.bookmarksHashMap[post._id]) {
                removePostBookmark();
            } else {
                bookmarkPost();
            }
        }
    }

    function copyLink(e: ButtonEvent) {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `https://readers-stash.netlify.app/post/${post._id}`
        );
        raiseToast("Link Copied");
    }

    function visitProfile(e: ButtonEvent, userName: string) {
        e.stopPropagation();
        navigate(`/${userName}`);
    }

    function toggleShowMenu(e: ButtonEvent) {
        e.stopPropagation();
        if (showDeleteMenu) {
            setShowDeleteMenu("");
        } else {
            setShowDeleteMenu(post._id);
        }
    }

    function openPostPage() {
        setShowDeleteMenu("");
        if (!isPostPage) {
            navigate(`/post/${post._id}`);
        }
    }

    function deletePost() {
        if (!loadingDeletePost) {
            setShowDeleteMenu("");
            const isConfirmed = window.confirm(
                "Are you sure you want to delete this post?"
            );
            if (isConfirmed) {
                removePost();
                if (isPostPage) {
                    navigate("/");
                }
            }
        }
    }

    return (
        <FlexContainer
            direction="column"
            w="40em"
            maxW="90vw"
            bgc="var(--card-color)"
            mb="2em"
            br="2em"
            p="0.3em 0"
            cursor={isPostPage ? "default" : "pointer"}
            onClick={openPostPage}
        >
            <FlexContainer p="0.7em 2em" align="center" justify="space-between">
                <FlexContainer align="center">
                    <ImageContainer>
                        <ImageDiv
                            bgImg={`url(${post.user?.profilePicture})`}
                            cursor="pointer"
                            onClick={(e: ButtonEvent) =>
                                visitProfile(e, post.user.userName)
                            }
                        />
                    </ImageContainer>
                    <FlexContainer
                        direction="column"
                        ml="0.5em"
                        justify="space-between"
                    >
                        <Container
                            cursor="pointer"
                            onClick={(e: ButtonEvent) =>
                                visitProfile(e, post.user.userName)
                            }
                        >
                            {post.user.name}
                        </Container>
                        <Container
                            color="var(--font-color-2)"
                            cursor="pointer"
                            onClick={(e: ButtonEvent) =>
                                visitProfile(e, post.user.userName)
                            }
                        >
                            @{post.user.userName}
                        </Container>
                    </FlexContainer>
                </FlexContainer>
                {post.user._id === user._id && (
                    <FlexContainer
                        onClick={toggleShowMenu}
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
                            <MoreSvg
                                className="scale-14"
                                color={"var(--font-color)"}
                            />
                        </FlexContainer>
                        {showDeleteMenu && (
                            <FlexContainer
                                position="absolute"
                                right="2.3em"
                                bgc="var(--bg-color)"
                                p="0.8em 1em"
                                br="1em"
                                onClick={deletePost}
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
            {post.image && (
                <Image
                    src={post.image}
                    h="16em"
                    mb="2em"
                    objectFit="cover"
                    loading="lazy"
                />
            )}
            <Container p="0em 2.5em">
                <Container fs="1.4rem" mb="1em">
                    {post.title}
                </Container>
                <Container whiteSpace="pre-wrap">{post.body}</Container>
            </Container>
            <FlexContainer p="1em 3em" justify="space-between" mt="0.5em">
                <FlexContainer
                    align="center"
                    cursor="pointer"
                    onClick={(e) => toggleLike(e)}
                >
                    <LikeSvg
                        fill={user.likesHashMap?.[post._id] ? "red" : "none"}
                        color={
                            user.likesHashMap?.[post._id]
                                ? "red"
                                : "var(--font-color)"
                        }
                        className="scale-12"
                    />
                    <Container
                        ml="1em"
                        hover={"text-decoration: underline"}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/likes?id=${post._id}`);
                        }}
                    >
                        {post.likesCount}
                    </Container>
                </FlexContainer>
                <FlexContainer align="center" cursor="pointer">
                    <CommentSvg
                        className="scale-11"
                        color={"var(--font-color)"}
                    />
                    <Container ml="1em">{post.commentsCount}</Container>
                </FlexContainer>
                <Container cursor="pointer" onClick={(e) => toggleBookmark(e)}>
                    {user.bookmarksHashMap?.[post._id] ? (
                        <BookmarkFilledSvg
                            className="scale-14"
                            color={"var(--font-color)"}
                        />
                    ) : (
                        <BookmarkSvg
                            className="scale-14"
                            color={"var(--font-color)"}
                        />
                    )}
                </Container>
                <Container cursor="pointer" onClick={copyLink}>
                    <ShareSvg
                        className="scale-12"
                        color={"var(--font-color)"}
                    />
                </Container>
            </FlexContainer>
        </FlexContainer>
    );
}
