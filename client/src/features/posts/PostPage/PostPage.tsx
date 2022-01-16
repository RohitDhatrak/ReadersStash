import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { InputEvent, FormEvent, Post as PostType } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { FlexContainer, Container } from "../../../components/Shared";
import {
    InputBox,
    ActionButton,
    Post,
    RenderComments,
} from "../../../components";
import { GET_POST } from "../../../graphql/queries";
import { loaded, getPosts } from "../postsSlice";
import { PageContainer } from "./style.postpage";

export function PostPage() {
    const [comment, setComment] = useState("");
    const [reply, setReply] = useState("");
    const [post, setPost] = useState<PostType>();
    const { pathname } = useLocation();
    const postId = pathname.split("/")[2];
    const COMMENT_LIMIT = 127;

    useQuery(GET_POST, {
        onCompleted(data) {
            setPost(data.getPost);
        },
        variables: { postId },
    });

    return (
        <PageContainer justify="center" mb="2em">
            <FlexContainer direction="column">
                {post && <Post post={post} key={post._id} />}
                <FlexContainer ml="2em" direction="column">
                    <FlexContainer fs="1.1rem">Comments</FlexContainer>
                    <InputBox
                        type="text"
                        placeholder="Write your comment here"
                        onChangeFunction={(e: InputEvent) =>
                            setComment(e.target.value)
                        }
                        color={
                            comment.length > COMMENT_LIMIT
                                ? "var(--error-color)"
                                : "initial"
                        }
                    />
                    {!!comment && (
                        <ActionButton
                            w="5em"
                            m="0.5em"
                            disabled={comment.length > COMMENT_LIMIT}
                        >
                            Post
                        </ActionButton>
                    )}
                    {post?.comments && (
                        <Container>
                            <RenderComments comments={post?.comments} />
                        </Container>
                    )}
                </FlexContainer>
            </FlexContainer>
        </PageContainer>
    );
}
