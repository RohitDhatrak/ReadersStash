import React from "react";
import { useAppSelector } from "../../app/hooks";
import { getUser } from "../../features/user/userSlice";
import { FlexContainer, Container, Image } from "../../components/Shared";
import { Post as PostType } from "../../types";
import { LikeSvg, CommentSvg, BookmarkSvg, ShareSvg } from "../../assets/svg";

export function Post({ post }: { post: PostType }) {
    return (
        <FlexContainer
            direction="column"
            w="40em"
            maxW="90vw"
            bgc="var(--card-color)"
            mb="2em"
            br="2em"
            p="0.3em 0"
        >
            <FlexContainer p="1em 2em" align="center">
                <Image src={post.user.profilePicture} h="3em" br="50%" />
                <FlexContainer direction="column" ml="0.5em">
                    <Container>{post.user.name}</Container>
                    <Container color="var(--font-color-2)">
                        @{post.user.userName}
                    </Container>
                </FlexContainer>
            </FlexContainer>
            {post.image && (
                <Image src={post.image} h="12em" mb="2em" objectFit="cover" />
            )}
            <Container p="0em 2.5em">
                <Container fs="1.4rem" mb="1em">
                    {post.title}
                </Container>
                <Container whiteSpace="pre-wrap">{post.body}</Container>
            </Container>
            <FlexContainer p="1em 3em" justify="space-between" mt="0.5em">
                <FlexContainer align="center">
                    <LikeSvg color={"none"} className="scale-12" />
                    <Container ml="1em">{post.likesCount}</Container>
                </FlexContainer>
                <FlexContainer align="center">
                    <CommentSvg className="scale-11" />
                    <Container ml="1em">{post.commentsCount}</Container>
                </FlexContainer>
                <BookmarkSvg className="scale-14" />
                <ShareSvg className="scale-12" />
            </FlexContainer>
        </FlexContainer>
    );
}
