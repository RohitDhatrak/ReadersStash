import React from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { FlexContainer, Container, Image } from "../../components/Shared";
import { Post as PostType, ButtonEvent } from "../../types";
import {
    LikeSvg,
    CommentSvg,
    BookmarkSvg,
    BookmarkFilledSvg,
    ShareSvg,
} from "../../assets/svg";
import {
    LIKE_POST,
    UNLIKE_POST,
    BOOKMARK,
    REMOVE_BOOKMARK,
} from "../../graphql/mutations";
import { liked, unliked } from "../../features/posts/postsSlice";
import {
    getUser,
    bookmark,
    removeBookmark,
} from "../../features/user/userSlice";

export function Post({ post }: { post: PostType }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);

    const [likePost] = useMutation(LIKE_POST, {
        onCompleted(data) {
            dispatch(liked(data.likePost));
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
        },
        variables: { postId: post._id, userId: user._id },
    });

    const [unlikePost] = useMutation(UNLIKE_POST, {
        onCompleted(data) {
            dispatch(unliked(data.unlikePost));
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
        },
        variables: { postId: post._id, userId: user._id },
    });

    const [bookmarkPost] = useMutation(BOOKMARK, {
        onCompleted(data) {
            dispatch(bookmark(data.bookmark));
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
        },
        variables: { postId: post._id, userId: user._id },
    });

    const [removePostBookmark] = useMutation(REMOVE_BOOKMARK, {
        onCompleted(data) {
            dispatch(removeBookmark(data.removeBookmark));
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
        },
        variables: { postId: post._id, userId: user._id },
    });

    function toggleLike(e: ButtonEvent) {
        e.preventDefault();
        if (user.likesHashMap[post._id]) {
            unlikePost();
        } else {
            likePost();
        }
    }

    function toggleBookmark(e: ButtonEvent) {
        e.preventDefault();
        if (user.bookmarksHashMap[post._id]) {
            removePostBookmark();
        } else {
            bookmarkPost();
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
        >
            <FlexContainer p="1em 2em" align="center">
                <Image src={post.user.profilePicture} h="3em" br="50%" />
                <FlexContainer direction="column" ml="0.5em">
                    <Container>{post.user.name}</Container>
                    <Container color="var(--font-color-2)">
                        @{post.user.userName}
                    </Container>
                </FlexContainer>
            </FlexContainer>
            {post.image && (
                <Image src={post.image} h="12em" mb="2em" objectFit="cover" />
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
                        color={user.likesHashMap?.[post._id] ? "red" : "none"}
                        className="scale-12"
                    />
                    <Container ml="1em">{post.likesCount}</Container>
                </FlexContainer>
                <FlexContainer align="center" cursor="pointer">
                    <CommentSvg className="scale-11" />
                    <Container ml="1em">{post.commentsCount}</Container>
                </FlexContainer>
                <Container cursor="pointer" onClick={(e) => toggleBookmark(e)}>
                    {user.bookmarksHashMap?.[post._id] ? (
                        <BookmarkFilledSvg className="scale-14" />
                    ) : (
                        <BookmarkSvg className="scale-14" />
                    )}
                </Container>
                <Container cursor="pointer">
                    <ShareSvg className="scale-12" />
                </Container>
            </FlexContainer>
        </FlexContainer>
    );
}
