import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { InputEvent, FormEvent, Post as PostType } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { FlexContainer, Container, Image } from "../../../components/Shared";
import { InputBox, ActionButton, Post } from "../../../components";
import { GET_PROFILE_DATA } from "../../../graphql/queries";
import { profileLoaded, getUser } from "../userSlice";
import { PageContainer } from "./style.profile";
import { Page404 } from "../../../pages";

export function Profile() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const { userName } = useParams();
    const [is404, set404] = useState(false);
    const [selectedSection, setSelectedSection] = useState("posts");

    useQuery(GET_PROFILE_DATA, {
        onCompleted(data) {
            if (!user?.email) {
                dispatch(profileLoaded(data.getUser));
            }
            set404(false);
        },
        onError() {
            set404(true);
        },
        variables: { userName },
    });

    if (is404) {
        return <Page404 />;
    }

    return !!user ? (
        <PageContainer direction="column">
            <FlexContainer>
                <Image src={user?.profilePicture} />
                <FlexContainer direction="column">
                    <Container>{user?.name}</Container>
                    <Container>{user?.userName}</Container>
                    <Container>{user?.bio}</Container>
                    <a href={user?.url}>{user?.url}</a>
                    <Container>{user?.location}</Container>
                    <FlexContainer>
                        <FlexContainer direction="row">
                            {user?.followersCount}
                            <Container>Followers</Container>
                        </FlexContainer>
                        <FlexContainer direction="row">
                            {user?.followingCount}
                            <Container>Following</Container>
                        </FlexContainer>
                    </FlexContainer>
                </FlexContainer>
            </FlexContainer>
            <FlexContainer justify="space-between">
                <Container onClick={() => setSelectedSection("posts")}>
                    Posts
                </Container>
                <Container onClick={() => setSelectedSection("liked")}>
                    Liked
                </Container>
                {user?.userName === userName && (
                    <Container onClick={() => setSelectedSection("bookmarked")}>
                        Bookmarked
                    </Container>
                )}
            </FlexContainer>
            <FlexContainer direction="column" align="center">
                {selectedSection === "posts" &&
                    user?.posts &&
                    [...user.posts]
                        .reverse()
                        .map((post: PostType) => (
                            <Post post={post} key={post?._id} />
                        ))}
                {selectedSection === "liked" &&
                    user?.liked &&
                    [...user.liked]
                        .reverse()
                        .map((post: PostType) => (
                            <Post post={post} key={post?._id} />
                        ))}
                {user?.userName === userName &&
                    user?.bookmarked &&
                    selectedSection === "bookmarked" &&
                    [...user.bookmarked]
                        .reverse()
                        .map((post: PostType) => (
                            <Post post={post} key={post?._id} />
                        ))}
            </FlexContainer>
        </PageContainer>
    ) : null;
}
