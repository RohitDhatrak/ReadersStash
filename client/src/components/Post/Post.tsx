import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, useLocation } from "react-router-dom";
import { raiseErrorToast, raiseToast, raiseError } from "../../utils/toast";
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

    let [likePost, { loading: likeLoading }] = useMutation(LIKE_POST, {
        onCompleted() {
            likeLoading = false;
        },
        onError() {
            dispatch(unliked(post));
            raiseError("Error liking post");
        },
        variables: { postId: post._id, userId: user._id },
    });

    let [unlikePost, { loading: unlikeLoading }] = useMutation(UNLIKE_POST, {
        onCompleted() {
            unlikeLoading = false;
        },
        onError() {
            dispatch(liked(post));
            raiseError("Error unliking post");
        },
        variables: { postId: post._id, userId: user._id },
    });

    let [bookmarkPost, { loading: bookmarkLoading }] = useMutation(BOOKMARK, {
        onCompleted() {
            bookmarkLoading = false;
        },
        onError() {
            dispatch(removeBookmark(post));
            raiseError("Error bookmarking post");
        },
        variables: { postId: post._id, userId: user._id },
    });

    let [removePostBookmark, { loading: removeBookmarkLoading }] = useMutation(
        REMOVE_BOOKMARK,
        {
            onCompleted() {
                removeBookmarkLoading = false;
            },
            onError() {
                dispatch(bookmark(post));
                raiseError("Error removing bookmark");
            },
            variables: { postId: post._id, userId: user._id },
        }
    );

    let [removePost, { loading: loadingDeletePost }] = useMutation(
        DELETE_POST,
        {
            onCompleted(data) {
                dispatch(remove(data.deletePost));
                loadingDeletePost = false;
                if (isPostPage) {
                    navigate("/");
                }
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
                dispatch(unliked(post));
                unlikePost();
            } else {
                dispatch(liked(post));
                likePost();
            }
        }
    }

    function toggleBookmark(e: ButtonEvent) {
        e.stopPropagation();
        if (!bookmarkLoading && !removeBookmarkLoading) {
            if (user.bookmarksHashMap[post._id]) {
                dispatch(removeBookmark(post));
                removePostBookmark();
            } else {
                dispatch(bookmark(post));
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

    function deletePost(e: ButtonEvent) {
        e.stopPropagation();
        if (!loadingDeletePost) {
            setShowDeleteMenu("");
            const isConfirmed = window.confirm(
                "Are you sure you want to delete this post?"
            );
            if (isConfirmed) {
                removePost();
            }
        }
    }

    function visitProfile(e: ButtonEvent) {
        e.stopPropagation();
        navigate(`/${post.user.userName}`);
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
            cursor="pointer"
            onClick={openPostPage}
        >
            <FlexContainer p="0.7em 2em" align="center" justify="space-between">
                <Container>
                    <FlexContainer
                        as="button"
                        p="0"
                        b="none"
                        fs="1rem"
                        bgc="transparent"
                        align="center"
                        onClick={visitProfile}
                    >
                        <ImageContainer>
                            <ImageDiv
                                bgImg={`url(${post.user?.profilePicture})`}
                                cursor="pointer"
                            />
                        </ImageContainer>
                        <FlexContainer
                            direction="column"
                            ml="0.5em"
                            align="flex-start"
                        >
                            <Container cursor="pointer">
                                {post.user.name}
                            </Container>
                            <Container
                                color="var(--font-color-2)"
                                cursor="pointer"
                            >
                                @{post.user.userName}
                            </Container>
                        </FlexContainer>
                    </FlexContainer>
                </Container>

                {post.user._id === user._id && (
                    <FlexContainer
                        onClick={toggleShowMenu}
                        cursor="pointer"
                        position="relative"
                    >
                        <FlexContainer
                            as="button"
                            align="center"
                            justify="center"
                            fs="1rem"
                            br="50%"
                            b="none"
                            bgc="transparent"
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
                                as="button"
                                b="none"
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
                                    {loadingDeletePost
                                        ? "Deleting..."
                                        : "Delete"}
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
                <Container fs="1.4rem" mb="1em" overFlowWrap="break-word">
                    {post.title}
                </Container>
                <Container whiteSpace="pre-wrap" overFlowWrap="break-word">
                    {post.body}
                </Container>
            </Container>
            <FlexContainer p="1em 3em" justify="space-between" mt="0.5em">
                <FlexContainer
                    align="center"
                    cursor="pointer"
                    onClick={(e: ButtonEvent) => {
                        e.stopPropagation();
                        toggleLike(e);
                    }}
                >
                    <FlexContainer
                        as="button"
                        b="none"
                        p="0"
                        bgc="transparent"
                        fs="1rem"
                        align="center"
                        cursor="pointer"
                    >
                        <LikeSvg
                            fill={
                                user.likesHashMap?.[post._id] ? "red" : "none"
                            }
                            color={
                                user.likesHashMap?.[post._id]
                                    ? "red"
                                    : "var(--font-color)"
                            }
                            className="scale-12"
                        />
                    </FlexContainer>
                    <Container
                        as="button"
                        b="none"
                        bgc="transparent"
                        fs="1rem"
                        ml="1em"
                        p="0"
                        cursor="pointer"
                        hover={"text-decoration: underline"}
                        onClick={(e: ButtonEvent) => {
                            e.stopPropagation();
                            navigate(`/likes?id=${post._id}`);
                        }}
                    >
                        {post.likesCount}
                    </Container>
                </FlexContainer>
                <FlexContainer
                    as="button"
                    b="none"
                    bgc="transparent"
                    fs="1rem"
                    align="center"
                    cursor="pointer"
                >
                    <CommentSvg
                        className="scale-11"
                        color={"var(--font-color)"}
                    />
                    <Container ml="1em">{post.commentsCount}</Container>
                </FlexContainer>
                <Container
                    as="button"
                    b="none"
                    bgc="transparent"
                    fs="1rem"
                    cursor="pointer"
                    onClick={(e: ButtonEvent) => {
                        e.stopPropagation();
                        toggleBookmark(e);
                    }}
                >
                    {user.bookmarksHashMap?.[post._id] ? (
                        <BookmarkFilledSvg
                            className="scale-13"
                            color={"var(--font-color)"}
                        />
                    ) : (
                        <BookmarkSvg
                            className="scale-13"
                            color={"var(--font-color)"}
                        />
                    )}
                </Container>
                <Container
                    as="button"
                    b="none"
                    bgc="transparent"
                    fs="1rem"
                    cursor="pointer"
                    onClick={copyLink}
                >
                    <ShareSvg
                        className="scale-11"
                        color={"var(--font-color)"}
                    />
                </Container>
            </FlexContainer>
        </FlexContainer>
    );
}
