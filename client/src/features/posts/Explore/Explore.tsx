import { useEffect } from "react";
import { Post as PostType } from "../../../types";
import { useAppSelector } from "../../../app/hooks";
import { FlexContainer, Container } from "../../../components/Shared";
import { Post } from "../../../components";
import { getPosts } from "../postsSlice";
import { PageContainer } from "./style.explore";
import { EmptyPageSvg } from "../../../assets/svg";

export function Explore() {
    const posts = useAppSelector(getPosts);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <PageContainer mb="5em" justify="center">
            <FlexContainer direction="column" align="center">
                {posts.map((post: PostType) => (
                    <Post post={post} key={post._id} />
                ))}
                {posts.length === 0 && (
                    <FlexContainer
                        direction="column"
                        align="center"
                        justify="center"
                        h="70vh"
                        maxW="90vw"
                    >
                        <EmptyPageSvg height="15em" />
                        <Container fs="1.4rem" mt="1em" textAlign="center">
                            Whoops! looks like there is nothing in here.
                        </Container>
                    </FlexContainer>
                )}
            </FlexContainer>
        </PageContainer>
    );
}
