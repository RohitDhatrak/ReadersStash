import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useLocation,
    useParams,
    Navigate,
} from "react-router-dom";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { useMediaQuery } from "react-responsive";
import { InputEvent, FormEvent, Post as PostType, User } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { FlexContainer, Container, Image } from "../../../components/Shared";
import { InputBox, ActionButton, Post } from "../../../components";
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
    const [profile, setProfile] = useState<User>();
    const [selectedSection, setSelectedSection] = useState<
        "posts" | "liked" | "bookmarked"
    >("posts");
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });
    const isFollowing = profile?._id
        ? user?.followingHashMap?.[profile?._id]
        : false;

    const { data, loading } = useQuery(GET_PROFILE_DATA, {
        onError() {
            set404(true);
        },
        variables: { userName },
    });

    useQuery(GET_PROFILE_DATA, {
        onCompleted(data) {
            if (!user?.email) {
                dispatch(profileLoaded(data.getUser));
            }
        },
        variables: { userName: user.userName },
    });

    useEffect(() => {
        if (userName === user.userName && user?.bio) {
            setProfile(user);
        } else {
            setProfile(data?.getUser);
        }
    }, [data, user]);

    const [followUser, { loading: loadingFollow }] = useMutation(FOLLOW_USER, {
        onCompleted(data) {
            if (profile?.followersCount !== undefined) {
                setProfile({
                    ...profile,
                    followersCount: profile?.followersCount + 1,
                });
                dispatch(followed(data.followUser));
            }
        },
        onError: raiseErrorToast("Some error occured please try again later"),
        variables: { userId: user._id, otherUserId: profile?._id },
    });

    const [unfollowUser, { loading: loadingUnfollow }] = useMutation(
        UNFOLLOW_USER,
        {
            onCompleted(data) {
                if (profile?.followersCount !== undefined) {
                    setProfile({
                        ...profile,
                        followersCount: profile?.followersCount - 1,
                    });
                    dispatch(unfollowed(data.unfollowUser));
                }
            },
            onError: raiseErrorToast(
                "Some error occured please try again later"
            ),
            variables: { userId: user._id, otherUserId: profile?._id },
        }
    );

    function toggleFollowing() {
        if (!loadingFollow && !loadingUnfollow) {
            if (isFollowing) {
                unfollowUser();
            } else {
                followUser();
            }
        }
    }

    if (loading)
        return (
            <FlexContainer h="75vh" justify="center" align="center">
                <LoaderSvg />
            </FlexContainer>
        );

    if (is404) {
        return <Page404 />;
    }

    return !!profile?.userName ? (
        <PageContainer direction="column" mb="5em">
            <FlexContainer
                w="40em"
                maxW="80vw"
                m={isTabletOrMobile ? "0 2.5em" : "0 auto"}
            >
                <ImageContainer>
                    <ImageDiv bgImg={`url(${profile?.profilePicture})`} />
                </ImageContainer>
                <FlexContainer direction="column" ml="2em">
                    <FlexContainer wrap="wrap" gap="0.5em">
                        <Container fs="1.3rem" fw={500} mr="1em">
                            @{profile?.userName}
                        </Container>
                        {user?.userName === userName ? (
                            <Container
                                as="button"
                                bgc="transparent"
                                b="1px solid #cecdcd"
                                fw={500}
                                fs="0.9rem"
                                cursor="pointer"
                                p="0em 1.5em"
                                br="1em"
                                onClick={() => navigate("/settings")}
                            >
                                Edit Profile
                            </Container>
                        ) : (
                            <Container
                                as="button"
                                bgc={
                                    isFollowing
                                        ? "transparent"
                                        : "var(--primary-color)"
                                }
                                b={isFollowing ? "1px solid #cecdcd" : "none"}
                                fw={500}
                                fs="0.9rem"
                                p="0em 1.5em"
                                br="1em"
                                cursor="pointer"
                                onClick={toggleFollowing}
                            >
                                {isFollowing ? "Following" : "Follow"}
                            </Container>
                        )}
                    </FlexContainer>
                    <DesktopProfileContainer>
                        <Container fw={600}>{profile?.name}</Container>
                        <Container whiteSpace="pre-wrap">
                            {profile?.bio}
                        </Container>
                        <Container
                            as="a"
                            target="_blank"
                            href={profile?.url}
                            color="#00376b"
                            fw={600}
                        >
                            {profile?.url}
                        </Container>
                        <FlexContainer>
                            <FlexContainer
                                direction="row"
                                cursor="pointer"
                                onClick={() =>
                                    navigate(`/followers?id=${profile._id}`)
                                }
                            >
                                <Container fw={600}>
                                    {profile?.followersCount}
                                </Container>
                                <Container ml="0.5em">Followers</Container>
                            </FlexContainer>
                            <FlexContainer
                                direction="row"
                                ml="1em"
                                cursor="pointer"
                                onClick={() =>
                                    navigate(`/following?id=${profile._id}`)
                                }
                            >
                                <Container fw={600}>
                                    {profile?.followingCount}
                                </Container>
                                <Container ml="0.5em">Following</Container>
                            </FlexContainer>
                        </FlexContainer>
                    </DesktopProfileContainer>
                </FlexContainer>
            </FlexContainer>
            <MobileProfileContainer>
                <Container fw={600}>{profile?.name}</Container>
                <Container whiteSpace="pre-wrap">{profile?.bio}</Container>
                <Container
                    as="a"
                    target="_blank"
                    href={profile?.url}
                    color="#00376b"
                    fw={600}
                >
                    {profile?.url}
                </Container>
                <FlexContainer mt="0.5em">
                    <FlexContainer
                        direction="row"
                        cursor="pointer"
                        onClick={() => navigate(`/followers?id=${profile._id}`)}
                    >
                        <Container fw={600}>
                            {profile?.followersCount}
                        </Container>
                        <Container ml="0.5em">Followers</Container>
                    </FlexContainer>
                    <FlexContainer
                        direction="row"
                        ml="1em"
                        cursor="pointer"
                        onClick={() => navigate(`/following?id=${profile._id}`)}
                    >
                        <Container fw={600}>
                            {profile?.followingCount}
                        </Container>
                        <Container ml="0.5em">Following</Container>
                    </FlexContainer>
                </FlexContainer>
            </MobileProfileContainer>
            <FlexContainer
                gap="3em"
                maxW="80vw"
                m="0 auto"
                mt="2em"
                p={isTabletOrMobile ? "1em 0.5em" : "1em 2em"}
            >
                <FlexContainer
                    onClick={() => setSelectedSection("posts")}
                    direction="column"
                    cursor="pointer"
                >
                    <FlexContainer align="center" gap="0.5em">
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
                    cursor="pointer"
                >
                    <FlexContainer align="center" gap="0.5em">
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
                        cursor="pointer"
                    >
                        <FlexContainer align="center" gap="0.5em">
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
            <FlexContainer direction="column" align="center">
                {profile?.[selectedSection] &&
                    [...profile?.[selectedSection]]
                        .reverse()
                        .map((post: PostType) => (
                            <Post post={post} key={post?._id} />
                        ))}
                {profile?.[selectedSection]?.length === 0 && (
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
