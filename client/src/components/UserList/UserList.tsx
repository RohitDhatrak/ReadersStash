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

export function UserList({ userList }: { userList: Array<User> }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userProfile = useAppSelector(getUser);

    const [followUser, { loading: loadingFollow }] = useMutation(FOLLOW_USER, {
        onCompleted(data) {
            dispatch(followed(data.followUser));
        },
        onError: raiseErrorToast("Some error occured please try again later"),
    });

    const [unfollowUser, { loading: loadingUnfollow }] = useMutation(
        UNFOLLOW_USER,
        {
            onCompleted(data) {
                dispatch(unfollowed(data.unfollowUser));
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
        <FlexContainer direction="column" m="0 auto" w="45em" maxW="90vw">
            {userList.map((user) => (
                <FlexContainer
                    key={user?._id}
                    onClick={() => navigate(`/${user?.userName}`)}
                    mb="1em"
                    cursor="pointer"
                >
                    <ImageContainer>
                        <ImageDiv
                            bgImg={`url(${user?.profilePicture})`}
                            loading="lazy"
                        />
                    </ImageContainer>
                    <Container ml="1em">
                        <FlexContainer justify="space-between">
                            <Container>
                                <Container fw={600}>{user?.name}</Container>
                                <Container color="var(--font-color-2)">
                                    @{user?.userName}
                                </Container>
                            </Container>
                            <Container
                                as="button"
                                bgc={
                                    userProfile?.followingHashMap?.[user?._id]
                                        ? "transparent"
                                        : "var(--primary-color)"
                                }
                                b={
                                    userProfile?.followingHashMap?.[user?._id]
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
                        </FlexContainer>
                        <Container fw={500} mt="0.5em">
                            {user?.bio}
                        </Container>
                    </Container>
                </FlexContainer>
            ))}
        </FlexContainer>
    );
}
