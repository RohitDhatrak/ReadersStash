import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ButtonEvent, Notification } from "../../types";
import { FlexContainer, Container } from "../../components/Shared";
import { PageContainer, ImageContainer, ImageDiv } from "./style.notifications";
import { EmptyPageSvg, LoaderSvg } from "../../assets/svg";
import { MARK_AS_READ } from "../../graphql/mutations";
import { useAppSelector } from "../../app/hooks";
import { getUser } from "../../features/user/userSlice";

export function Notifications({
    notifications = [],
    notificationLoading,
    setNotifications,
    setUnreadCount,
}: {
    notifications: Array<Notification>;
    notificationLoading: boolean;
    setNotifications: Function;
    setUnreadCount: Function;
}) {
    const user = useAppSelector(getUser);
    const navigate = useNavigate();

    const [markAsRead] = useMutation(MARK_AS_READ, {
        onCompleted(data) {
            setNotifications(data.markAsRead);
            let count = 0;
            for (const notification of data.markAsRead) {
                if (!notification.isRead) count++;
                else break;
            }
            setUnreadCount(count);
        },
        variables: {
            userId: user._id,
        },
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        return () => {
            markAsRead();
        };
    }, []);

    function handleClick(notification: Notification) {
        if (notification.type === "Like" && notification?.post)
            navigate(`/post/${notification.post._id}`);
        else if (
            (notification.type === "Comment" ||
                notification.type === "Reply") &&
            notification?.post &&
            notification?.comment
        )
            navigate(
                `/post/${notification.post._id}#${notification.comment._id}`
            );
        else if (notification.type === "Follow")
            navigate(`/${notification.from.userName}`);
    }

    function visitProfile(e: ButtonEvent, notification: Notification) {
        e.stopPropagation();
        navigate(`/${notification.from.userName}`);
    }

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
                        p="1em"
                        br="1em"
                        mb="0.5em"
                        align={
                            notification.type === "Follow"
                                ? "center"
                                : "flex-start"
                        }
                        bgc={
                            notification.isRead
                                ? "var(--card-color)"
                                : "#dbeafe"
                        }
                        cursor="pointer"
                        onClick={() => handleClick(notification)}
                        as="button"
                        b="none"
                        fs="1rem"
                        textAlign="start"
                    >
                        <Container
                            as="button"
                            p="0"
                            b="none"
                            bgc="transparent"
                            fs="1rem"
                            onClick={(e: ButtonEvent) =>
                                visitProfile(e, notification)
                            }
                            cursor="pointer"
                        >
                            <ImageContainer>
                                <ImageDiv
                                    bgImg={`url(${notification?.from.profilePicture})`}
                                />
                            </ImageContainer>
                        </Container>

                        {notification.type === "Like" && (
                            <Container>
                                <Container
                                    as="button"
                                    p="0"
                                    b="none"
                                    bgc="transparent"
                                    fs="1rem"
                                    onClick={(e: ButtonEvent) =>
                                        visitProfile(e, notification)
                                    }
                                    cursor="pointer"
                                    fw={600}
                                >
                                    {`${notification.from.name}`}
                                </Container>{" "}
                                liked your post
                                {notification?.post && (
                                    <Container
                                        fs="0.9rem"
                                        color="var(--font-color-2)"
                                        mt="1em"
                                        whiteSpace="pre-wrap"
                                        cursor="pointer"
                                    >
                                        {notification.post.body}
                                    </Container>
                                )}
                            </Container>
                        )}
                        {(notification.type === "Comment" ||
                            notification.type === "Reply") && (
                            <Container>
                                <Container
                                    as="button"
                                    p="0"
                                    b="none"
                                    bgc="transparent"
                                    fs="1rem"
                                    onClick={(e: ButtonEvent) =>
                                        visitProfile(e, notification)
                                    }
                                    cursor="pointer"
                                    fw={600}
                                >
                                    {`${notification.from.name}`}
                                </Container>
                                {notification.type === "Comment" && (
                                    <Container display="inline">
                                        {" "}
                                        commented on your post
                                    </Container>
                                )}
                                {notification.type === "Reply" && (
                                    <Container display="inline">
                                        {" "}
                                        replied to your comment
                                    </Container>
                                )}
                                {notification?.comment && notification?.post && (
                                    <Container
                                        fs="0.9rem"
                                        mt="1em"
                                        whiteSpace="pre-wrap"
                                        cursor="pointer"
                                    >
                                        {notification.comment.body}
                                    </Container>
                                )}
                            </Container>
                        )}
                        {notification.type === "Follow" && (
                            <Container>
                                <Container
                                    as="button"
                                    p="0"
                                    b="none"
                                    bgc="transparent"
                                    fs="1rem"
                                    onClick={(e: ButtonEvent) =>
                                        visitProfile(e, notification)
                                    }
                                    cursor="pointer"
                                    fw={600}
                                >
                                    {`${notification.from.name}`}
                                </Container>{" "}
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
