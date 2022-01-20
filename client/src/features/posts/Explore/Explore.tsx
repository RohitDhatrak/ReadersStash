import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { InputEvent, FormEvent, Post as PostType } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { FlexContainer, Container } from "../../../components/Shared";
import { InputBox, ActionButton, Post } from "../../../components";
import { GET_POSTS } from "../../../graphql/queries";
import { loaded, getPosts } from "../postsSlice";

export function Explore() {
    const dispatch = useAppDispatch();
    const posts = useAppSelector(getPosts);

    useQuery(GET_POSTS, {
        onCompleted(data) {
            if (posts.length === 0) {
                dispatch(loaded(data.getPosts));
            }
        },
    });

    return <Container>Explore</Container>;
}
