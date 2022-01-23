import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { InputEvent, FormEvent, Post as PostType } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { FlexContainer, Container } from "../../../components/Shared";
import { InputBox, ActionButton, Post } from "../../../components";
import { GET_POSTS } from "../../../graphql/queries";

export function Notifications() {
    // return <PageContainer mb="5em">Notifications</PageContainer>;
    return <div></div>;
}
