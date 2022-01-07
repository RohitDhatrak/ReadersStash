import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { InputEvent, FormEvent, Post as PostType } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { FlexContainer, Container } from "../../../components/Shared";
import { InputBox, ActionButton, Post } from "../../../components";
import { GET_POSTS } from "../../../graphql/queries";
import { postsLoaded } from "../postsSlice";
import { PageContainer } from "./style.feed";

export function Feed() {
    const dispatch = useAppDispatch();
    const { data } = useQuery(GET_POSTS, {
        onCompleted(data) {
            dispatch(postsLoaded(data.getPosts));
        },
    });

    return (
        <PageContainer mb="2em" justify="center">
            <FlexContainer direction="column" align="center">
                {data?.getPosts?.map((post: PostType) => (
                    <Post post={post} key={post._id} />
                ))}
            </FlexContainer>
        </PageContainer>
    );
}
