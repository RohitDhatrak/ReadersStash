import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { InputEvent, FormEvent, Post as PostType } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { FlexContainer, Container } from "../../../components/Shared";
import { InputBox, ActionButton, Post } from "../../../components";
import { GET_POSTS } from "../../../graphql/queries";
import { loaded, getPosts } from "../postsSlice";
import { PageContainer } from "./style.explore";
import { EmptyPageSvg } from "../../../assets/svg";

export function Explore() {
    const posts = useAppSelector(getPosts);

    return (
        <PageContainer mb="5em" justify="center">
            <FlexContainer direction="column" align="center">
                {posts.map((post: PostType) => (
                    <Post post={post} key={post._id} />
                ))}
                {posts.length === 0 && (
                    <FlexContainer direction="column">
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
