import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import {
    InputEvent,
    FormEvent,
    Post as PostType,
    Notification,
} from "../../types";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { FlexContainer, Container } from "../../components/Shared";
import { InputBox, ActionButton, Post } from "../../components";
import { GET_POSTS } from "../../graphql/queries";
import { PageContainer, ImageContainer, ImageDiv } from "./style.notifications";
import { EmptyPageSvg, LoaderSvg } from "../../assets/svg";

export function Notifications({
    notifications = [],
    notificationLoading,
}: {
    notifications: Array<Notification>;
    notificationLoading: boolean;
}) {
    if (notificationLoading)
        return (
            <FlexContainer h="75vh" justify="center" align="center">
                <LoaderSvg />
            </FlexContainer>
        );

    return (
        <PageContainer mb="5em" align="center" direction="column">
            {notifications.map((notification) => {
                return (
                    <FlexContainer
                        key={notification._id}
                        w="40em"
                        maxW="90vw"
                        gap="1em"
                        mb="1.5em"
                        align={
                            notification.type === "Follow"
                                ? "center"
                                : "flex-start"
                        }
                    >
                        <Link to={`/${notification.from.userName}`}>
                            <ImageContainer>
                                <ImageDiv
                                    bgImg={`url(${notification?.from.profilePicture})`}
                                />
                            </ImageContainer>
                        </Link>

                        {notification.type === "Like" && (
                            <Container>
                                <Container>
                                    <Link to={`/${notification.from.userName}`}>
                                        <b> {`${notification.from.name}`}</b>
                                    </Link>{" "}
                                    liked your post
                                </Container>
                                {notification?.post && (
                                    <Link to={`/post/${notification.post._id}`}>
                                        <Container
                                            fs="0.9rem"
                                            color="var(--font-color-2)"
                                            mt="1em"
                                            whiteSpace="pre-wrap"
                                            cursor="pointer"
                                        >
                                            {notification.post.body}
                                        </Container>
                                    </Link>
                                )}
                            </Container>
                        )}
                        {notification.type === "Comment" && (
                            <Container>
                                <Container>
                                    <Link to={`/${notification.from.userName}`}>
                                        <b> {`${notification.from.name}`}</b>
                                    </Link>{" "}
                                    commented on your post
                                </Container>
                                {notification?.comment && notification?.post && (
                                    <Link
                                        to={`/post/${notification.post._id}#${notification.comment._id}`}
                                    >
                                        <Container
                                            fs="0.9rem"
                                            mt="1em"
                                            whiteSpace="pre-wrap"
                                            cursor="pointer"
                                        >
                                            {notification.comment.body}
                                        </Container>
                                    </Link>
                                )}
                            </Container>
                        )}
                        {notification.type === "Reply" && (
                            <Container>
                                <Container>
                                    <Link to={`/${notification.from.userName}`}>
                                        <b> {`${notification.from.name}`}</b>
                                    </Link>{" "}
                                    replied to your comment
                                </Container>
                                {notification?.comment && notification?.post && (
                                    <Link
                                        to={`/post/${notification.post._id}#${notification.comment._id}`}
                                    >
                                        <Container
                                            fs="0.9rem"
                                            mt="1em"
                                            whiteSpace="pre-wrap"
                                            cursor="pointer"
                                        >
                                            {notification.comment.body}
                                        </Container>
                                    </Link>
                                )}
                            </Container>
                        )}
                        {notification.type === "Follow" && (
                            <Container>
                                <Link to={`/${notification.from.userName}`}>
                                    <b> {`${notification.from.name}`}</b>
                                </Link>{" "}
                                followed you
                            </Container>
                        )}
                    </FlexContainer>
                );
            })}
            {notifications.length === 0 && (
                <FlexContainer
                    direction="column"
                    maxW="90vw"
                    align="center"
                    justify="center"
                    h="70vh"
                >
                    <EmptyPageSvg height="15em" />
                    <Container fs="1.4rem" mt="1em" textAlign="center">
                        Looks like you are all caught up!
                    </Container>
                </FlexContainer>
            )}
        </PageContainer>
    );
}
