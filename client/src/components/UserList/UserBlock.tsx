import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { raiseError } from "../../utils/toast";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { FlexContainer, Container } from "../../components/Shared";
import { User, ButtonEvent } from "../../types";
import { getUser, followed, unfollowed } from "../../features/user/userSlice";
import { ImageContainer, ImageDiv } from "./style.userList";
import { FOLLOW_USER, UNFOLLOW_USER } from "../../graphql/mutations";

export function UserBlock({ user }: { user: User }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userProfile = useAppSelector(getUser);

    let [followUser, { loading: loadingFollow }] = useMutation(FOLLOW_USER, {
        onCompleted() {
            loadingFollow = false;
        },
        onError() {
            dispatch(unfollowed(user));
            raiseError("Couldn't follow user, please try again later");
        },
    });

    let [unfollowUser, { loading: loadingUnfollow }] = useMutation(
        UNFOLLOW_USER,
        {
            onCompleted() {
                loadingUnfollow = false;
            },
            onError() {
                dispatch(followed(user));
                raiseError("Couldn't unfollow user, please try again later");
            },
        }
    );

    function toggleFollowing(e: ButtonEvent) {
        e.stopPropagation();
        if (!loadingFollow && !loadingUnfollow) {
            if (userProfile?.followingHashMap?.[user?._id]) {
                dispatch(unfollowed(user));
                unfollowUser({
                    variables: {
                        userId: userProfile._id,
                        otherUserId: user?._id,
                    },
                });
            } else {
                dispatch(followed(user));
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
                <FlexContainer justify="space-between" w="40em" maxW="67vw">
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
                            onClick={toggleFollowing}
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
    );
}
