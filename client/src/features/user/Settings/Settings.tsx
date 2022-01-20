import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { useMediaQuery } from "react-responsive";
import { InputEvent, FormEvent, Post as PostType, User } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { FlexContainer, Container, Image } from "../../../components/Shared";
import { InputBox, ActionButton, Post } from "../../../components";
import { GET_PROFILE_DATA } from "../../../graphql/queries";
import { FOLLOW_USER, UNFOLLOW_USER } from "../../../graphql/mutations";
import { profileLoaded, getUser, followed, unfollowed } from "../userSlice";
import { Page404 } from "../../../pages";
import { LikeSvg, BookmarkSvg, PostSvg } from "../../../assets/svg";
import { raiseErrorToast } from "../../../utils/toast";

export function Settings() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);

    return <Container>Settings</Container>;
}
