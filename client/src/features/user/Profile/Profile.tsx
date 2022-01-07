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

    const { data } = useQuery(GET_PROFILE_DATA, {
        onCompleted(data) {
            dispatch(profileLoaded(data.getUser));
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

    return !!data?.getUser ? (
        <PageContainer direction="column">
            <FlexContainer>
                <Image src={data?.getUser?.profilePicture} />
                <FlexContainer direction="column">
                    <Container>{data?.getUser?.name}</Container>
                    <Container>{data?.getUser?.userName}</Container>
                    <Container>{data?.getUser?.bio}</Container>
                    <a href={data?.getUser?.url}>{data?.getUser?.url}</a>
                    <Container>{data?.getUser?.location}</Container>
                    <FlexContainer>
                        <FlexContainer direction="row">
                            {data?.getUser?.followersCount}
                            <Container>Followers</Container>
                        </FlexContainer>
                        <FlexContainer direction="row">
                            {data?.getUser?.followingCount}
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
                    [...data?.getUser?.posts]
                        .reverse()
                        .map((post: PostType) => (
                            <Post post={post} key={post?._id} />
                        ))}
                {selectedSection === "liked" &&
                    [...data?.getUser?.liked]
                        .reverse()
                        .map((post: PostType) => (
                            <Post post={post} key={post?._id} />
                        ))}
                {user?.userName === userName &&
                    selectedSection === "bookmarked" &&
                    [...data?.getUser?.bookmarked]
                        .reverse()
                        .map((post: PostType) => (
                            <Post post={post} key={post?._id} />
                        ))}
            </FlexContainer>
        </PageContainer>
    ) : null;
}
