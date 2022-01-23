import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { InputEvent, FormEvent, Post as PostType } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { FlexContainer, Container } from "../../../components/Shared";
import { InputBox, ActionButton, Post } from "../../../components";
import { GET_POSTS } from "../../../graphql/queries";
import { PageContainer } from "./style.notifications";
import { EmptyPageSvg } from "../../../assets/svg";

export function Notifications() {
    const notifications: any = [];
    return (
        <PageContainer mb="5em" justify="center">
            {notifications.length === 0 && (
                <FlexContainer direction="column" maxW="90vw">
                    <EmptyPageSvg height="15em" />
                    <Container fs="1.4rem" mt="1em" textAlign="center">
                        Looks like you are all caught up!
                    </Container>
                </FlexContainer>
            )}
        </PageContainer>
    );
}
