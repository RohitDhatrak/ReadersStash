import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { useMediaQuery } from "react-responsive";
import { Post as PostType } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { FlexContainer, Container } from "../../../components/Shared";
import { Post } from "../../../components";
import { GET_PROFILE_DATA } from "../../../graphql/queries";
import { FOLLOW_USER, UNFOLLOW_USER } from "../../../graphql/mutations";
import { profileLoaded, getUser, followed, unfollowed } from "../userSlice";
import {
    PageContainer,
    ImageContainer,
    ImageDiv,
    DesktopProfileContainer,
    MobileProfileContainer,
} from "./style.profile";
import { Page404 } from "../../../pages";
import {
    LikeSvg,
    BookmarkSvg,
    PostSvg,
    LoaderSvg,
    EmptyPageSvg,
} from "../../../assets/svg";
import { raiseErrorToast } from "../../../utils/toast";

export function Profile() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(getUser);
    const { userName } = useParams();
    const [is404, set404] = useState(false);
    const [selectedSection, setSelectedSection] = useState<
        "posts" | "liked" | "bookmarked"
    >("posts");
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });

    const { loading, data, refetch } = useQuery(GET_PROFILE_DATA, {
        onError() {
            set404(true);
        },
        variables: { userName },
    });

    const isFollowing = data?.getUser?._id
        ? user?.followingHashMap?.[data?.getUser?._id]
        : false;

    useQuery(GET_PROFILE_DATA, {
        onCompleted(data) {
            if (!user?.email) {
                dispatch(profileLoaded(data.getUser));
            }
        },
        variables: { userName: user.userName },
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [userName]);

    useEffect(() => {
        refetch();
    }, [userName, user]);

    const [followUser, { loading: loadingFollow }] = useMutation(FOLLOW_USER, {
        onCompleted(data) {
            console.log("in follow");
            refetch();
            dispatch(followed(data.followUser));
        },
        onError: raiseErrorToast("Some error occured please try again later"),
    });

    const [unfollowUser, { loading: loadingUnfollow }] = useMutation(
        UNFOLLOW_USER,
        {
            onCompleted(data) {
                console.log("in unfollow");
                refetch();
                dispatch(unfollowed(data.unfollowUser));
            },
            onError: raiseErrorToast(
                "Some error occured please try again later"
            ),
        }
    );

    function toggleFollowing() {
        if (!loadingFollow && !loadingUnfollow) {
            if (isFollowing) {
                unfollowUser({
                    variables: {
                        userId: user._id,
                        otherUserId: data?.getUser?._id,
                    },
                });
            } else {
                followUser({
                    variables: {
                        userId: user._id,
                        otherUserId: data?.getUser?._id,
                    },
                });
            }
        }
    }

    if ((!user?.email || user.userName !== userName) && loading)
        return (
            <FlexContainer h="75vh" justify="center" align="center">
                <LoaderSvg />
            </FlexContainer>
        );

    if (is404) {
        return <Page404 />;
    }

    return !!data?.getUser?.userName ? (
        <PageContainer direction="column" mb="5em">
            <FlexContainer
                w="40em"
                maxW="80vw"
                m={isTabletOrMobile ? "0 2.5em" : "0 auto"}
            >
                <ImageContainer>
                    <ImageDiv bgImg={`url(${data?.getUser?.profilePicture})`} />
                </ImageContainer>
                <FlexContainer direction="column" ml="2em">
                    <FlexContainer wrap="wrap" gap="0.5em">
                        <Container fs="1.3rem" fw={500} mr="1em">
                            @{data?.getUser?.userName}
                        </Container>
                        {user?.userName === data?.getUser.userName && (
                            <Container
                                as="button"
                                bgc="transparent"
                                b="1px solid #cecdcd"
                                fw={500}
                                fs="0.9rem"
                                cursor="pointer"
                                p="0.2em 1.5em"
                                br="1em"
                                onClick={() => navigate("/settings")}
                            >
                                Edit Profile
                            </Container>
                        )}
                        {user?.userName !== data?.getUser.userName &&
                            user?._id && (
                                <Container
                                    as="button"
                                    bgc={
                                        isFollowing
                                            ? "transparent"
                                            : "var(--primary-color)"
                                    }
                                    b={
                                        isFollowing
                                            ? "1px solid #cecdcd"
                                            : "none"
                                    }
                                    fw={500}
                                    fs="0.9rem"
                                    p="0.2em 1.5em"
                                    br="1em"
                                    cursor="pointer"
                                    onClick={toggleFollowing}
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </Container>
                            )}
                    </FlexContainer>
                    <DesktopProfileContainer>
                        <Container fw={600}>{data?.getUser?.name}</Container>
                        <Container whiteSpace="pre-wrap">
                            {data?.getUser?.bio}
                        </Container>
                        <Container
                            as="a"
                            target="_blank"
                            href={data?.getUser?.url}
                            color="#00376b"
                            fw={600}
                        >
                            {data?.getUser?.url}
                        </Container>
                        <FlexContainer>
                            <FlexContainer
                                direction="row"
                                cursor="pointer"
                                as="button"
                                b="none"
                                bgc="transparent"
                                fs="1rem"
                                onClick={() =>
                                    navigate(
                                        `/followers?id=${data?.getUser._id}`
                                    )
                                }
                            >
                                <Container fw={600}>
                                    {data?.getUser?.followersCount}
                                </Container>
                                <Container ml="0.5em">Followers</Container>
                            </FlexContainer>
                            <FlexContainer
                                direction="row"
                                ml="1em"
                                cursor="pointer"
                                as="button"
                                b="none"
                                bgc="transparent"
                                fs="1rem"
                                onClick={() =>
                                    navigate(
                                        `/following?id=${data?.getUser._id}`
                                    )
                                }
                            >
                                <Container fw={600}>
                                    {data?.getUser?.followingCount}
                                </Container>
                                <Container ml="0.5em">Following</Container>
                            </FlexContainer>
                        </FlexContainer>
                    </DesktopProfileContainer>
                </FlexContainer>
            </FlexContainer>
            <MobileProfileContainer>
                <Container fw={600}>{data?.getUser?.name}</Container>
                <Container whiteSpace="pre-wrap">
                    {data?.getUser?.bio}
                </Container>
                <Container
                    as="a"
                    target="_blank"
                    href={data?.getUser?.url}
                    color="#00376b"
                    fw={600}
                >
                    {data?.getUser?.url}
                </Container>
                <FlexContainer mt="0.5em">
                    <FlexContainer
                        direction="row"
                        cursor="pointer"
                        onClick={() =>
                            navigate(`/followers?id=${data?.getUser._id}`)
                        }
                    >
                        <Container fw={600}>
                            {data?.getUser?.followersCount}
                        </Container>
                        <Container ml="0.5em">Followers</Container>
                    </FlexContainer>
                    <FlexContainer
                        direction="row"
                        ml="1em"
                        cursor="pointer"
                        onClick={() =>
                            navigate(`/following?id=${data?.getUser._id}`)
                        }
                    >
                        <Container fw={600}>
                            {data?.getUser?.followingCount}
                        </Container>
                        <Container ml="0.5em">Following</Container>
                    </FlexContainer>
                </FlexContainer>
            </MobileProfileContainer>
            <FlexContainer
                gap="2em"
                maxW="80vw"
                m="0 auto"
                mt="2em"
                p={isTabletOrMobile ? "1em 0.5em" : "1em 2em"}
            >
                <FlexContainer
                    onClick={() => setSelectedSection("posts")}
                    direction="column"
                >
                    <FlexContainer
                        as="button"
                        b="none"
                        bgc="transparent"
                        fs="1rem"
                        align="center"
                        gap="0.5em"
                        cursor="pointer"
                    >
                        {!isTabletOrMobile && (
                            <PostSvg color="var(--font-color)" />
                        )}
                        <Container>Posts</Container>
                    </FlexContainer>
                    {selectedSection === "posts" && (
                        <Container
                            bgc="var(--secondary-color)"
                            h="0.25em"
                            color="transparent"
                            mt="0.2em"
                        >
                            .
                        </Container>
                    )}
                </FlexContainer>
                <FlexContainer
                    onClick={() => setSelectedSection("liked")}
                    direction="column"
                >
                    <FlexContainer
                        as="button"
                        b="none"
                        bgc="transparent"
                        fs="1rem"
                        align="center"
                        gap="0.5em"
                        cursor="pointer"
                    >
                        {!isTabletOrMobile && (
                            <LikeSvg
                                fill="none"
                                color="var(--font-color)"
                                strokeWidth={5}
                            />
                        )}
                        <Container>Liked</Container>
                    </FlexContainer>
                    {selectedSection === "liked" && (
                        <Container
                            bgc="var(--secondary-color)"
                            h="0.25em"
                            color="transparent"
                            mt="0.2em"
                        >
                            .
                        </Container>
                    )}
                </FlexContainer>
                {user?.userName === userName && (
                    <FlexContainer
                        onClick={() => setSelectedSection("bookmarked")}
                        direction="column"
                    >
                        <FlexContainer
                            as="button"
                            b="none"
                            bgc="transparent"
                            fs="1rem"
                            align="center"
                            gap="0.5em"
                            cursor="pointer"
                        >
                            {!isTabletOrMobile && (
                                <BookmarkSvg
                                    className="scale-12"
                                    color="var(--font-color)"
                                />
                            )}
                            <Container>Bookmarked</Container>
                        </FlexContainer>
                        {selectedSection === "bookmarked" && (
                            <Container
                                bgc="var(--secondary-color)"
                                h="0.25em"
                                color="transparent"
                                mt="0.2em"
                            >
                                .
                            </Container>
                        )}
                    </FlexContainer>
                )}
            </FlexContainer>
            <FlexContainer direction="column" align="center" mt="1em">
                {data?.getUser?.[selectedSection] &&
                    [...data?.getUser?.[selectedSection]]
                        .reverse()
                        .map((post: PostType) => (
                            <Post post={post} key={post?._id} />
                        ))}
                {data?.getUser?.[selectedSection]?.length === 0 && (
                    <FlexContainer direction="column" mt="2em" maxW="90vw">
                        <EmptyPageSvg height="12em" />
                        <Container fs="1.2rem" mt="1em" textAlign="center">
                            Whoops! looks like there is nothing in here.
                        </Container>
                    </FlexContainer>
                )}
            </FlexContainer>
        </PageContainer>
    ) : null;
}
