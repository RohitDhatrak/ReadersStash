import { useEffect } from "react";
import { Post as PostType } from "../../../types";
import { useAppSelector } from "../../../app/hooks";
import { FlexContainer, Container, Image } from "../../../components/Shared";
import { Post } from "../../../components";
import { getPosts } from "../postsSlice";
import { PageContainer } from "./style.feed";
import checkIcon from "../../../assets/checked.png";
import { getUser } from "../../user/userSlice";

export function Feed() {
    const posts = useAppSelector(getPosts);
    const user = useAppSelector(getUser);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <PageContainer mb="5em" justify="center">
            <FlexContainer direction="column" align="center">
                {posts.map((post: PostType) =>
                    user.followingHashMap?.[post.user._id] ? (
                        <Post post={post} key={post._id} />
                    ) : null
                )}
                <FlexContainer
                    direction="column"
                    textAlign="center"
                    w="100%"
                    maxW="90vw"
                    bgc="var(--card-color)"
                    pb="1em"
                >
                    <Container
                        w="100%"
                        h="0.3em"
                        bgc="var(--primary-color)"
                        color="transparent"
                    >
                        .
                    </Container>
                    <Image
                        src={checkIcon}
                        w="3em"
                        m="0 auto"
                        mt="1em"
                        mb="1em"
                    />
                    <Container fs="1.1rem" mb="0.5em">
                        You are all caught up!
                    </Container>
                    <Container fw={500} m="0 1.5em">
                        Empty Feed? Find new content and people on the explore
                        page.
                    </Container>
                </FlexContainer>
            </FlexContainer>
        </PageContainer>
    );
}
