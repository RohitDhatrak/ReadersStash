import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { raiseErrorToast, raiseToast } from "../../utils/toast";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { FlexContainer, Container, Image } from "../../components/Shared";
import { User, ButtonEvent } from "../../types";
import {} from "../../graphql/mutations";
import { liked, unliked, remove } from "../../features/posts/postsSlice";
import { getUser, followed, unfollowed } from "../../features/user/userSlice";
import { ImageContainer, ImageDiv } from "./style.userList";
import { FOLLOW_USER, UNFOLLOW_USER } from "../../graphql/mutations";
import { EmptyPageSvg } from "../../assets/svg";

export function UserList({
    userList,
    showEmptyPage = true,
}: {
    userList: Array<User>;
    showEmptyPage?: boolean;
}) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userProfile = useAppSelector(getUser);

    let [followUser, { loading: loadingFollow }] = useMutation(FOLLOW_USER, {
        onCompleted(data) {
            dispatch(followed(data.followUser));
            loadingFollow = false;
        },
        onError: raiseErrorToast("Some error occured please try again later"),
    });

    let [unfollowUser, { loading: loadingUnfollow }] = useMutation(
        UNFOLLOW_USER,
        {
            onCompleted(data) {
                dispatch(unfollowed(data.unfollowUser));
                loadingUnfollow = false;
            },
            onError: raiseErrorToast(
                "Some error occured please try again later"
            ),
        }
    );

    function toggleFollowing(e: ButtonEvent, user: User) {
        e.stopPropagation();
        if (!loadingFollow && !loadingUnfollow) {
            if (userProfile?.followingHashMap?.[user?._id]) {
                unfollowUser({
                    variables: {
                        userId: userProfile._id,
                        otherUserId: user?._id,
                    },
                });
            } else {
                followUser({
                    variables: {
                        userId: userProfile._id,
                        otherUserId: user?._id,
                    },
                });
            }
        }
    }

    return (
        <FlexContainer direction="column" m="0 auto" w="40em" maxW="90vw">
            {[...userList].reverse().map((user) => (
                <FlexContainer
                    key={user?._id}
                    onClick={() => navigate(`/${user?.userName}`)}
                    mb="1em"
                    cursor="pointer"
                >
                    <ImageContainer>
                        <ImageDiv bgImg={`url(${user?.profilePicture})`} />
                    </ImageContainer>
                    <Container ml="1em">
                        <FlexContainer
                            justify="space-between"
                            w="40em"
                            maxW="67vw"
                        >
                            <Link to={`/${user?.userName}`}>
                                <Container>
                                    <Container fw={600}>{user?.name}</Container>
                                    <Container color="var(--font-color-2)">
                                        @{user?.userName}
                                    </Container>
                                </Container>
                            </Link>
                            {user._id !== userProfile._id && (
                                <Container
                                    as="button"
                                    bgc={
                                        userProfile?.followingHashMap?.[
                                            user?._id
                                        ]
                                            ? "transparent"
                                            : "var(--primary-color)"
                                    }
                                    b={
                                        userProfile?.followingHashMap?.[
                                            user?._id
                                        ]
                                            ? "1px solid #cecdcd"
                                            : "none"
                                    }
                                    fw={500}
                                    fs="0.9rem"
                                    cursor="pointer"
                                    p="0 1em"
                                    br="1em"
                                    onClick={(e: ButtonEvent) =>
                                        toggleFollowing(e, user)
                                    }
                                >
                                    {userProfile?.followingHashMap?.[user?._id]
                                        ? "Following"
                                        : "Follow"}
                                </Container>
                            )}
                        </FlexContainer>
                        <Container fw={500} mt="0.5em">
                            {user?.bio}
                        </Container>
                    </Container>
                </FlexContainer>
            ))}
            {userList?.length === 0 && showEmptyPage && (
                <FlexContainer direction="column">
                    <EmptyPageSvg height="15em" />
                    <Container fs="1.4rem" mt="1em" textAlign="center">
                        Whoops! looks like there is nothing in here.
                    </Container>
                </FlexContainer>
            )}
        </FlexContainer>
    );
}
