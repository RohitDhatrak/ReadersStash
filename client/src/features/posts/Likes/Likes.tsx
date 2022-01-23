import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { User } from "../../../types";
import { UserList } from "../../../components";
import { GET_LIKES } from "../../../graphql/queries";
import { PageContainer } from "./style.likes";
import { raiseErrorToast } from "../../../utils/toast";
import { LoaderSvg } from "../../../assets/svg";
import { FlexContainer } from "../../../components/Shared";

export function Likes() {
    const [userList, setUserList] = useState<Array<User>>([]);
    const { search = "" } = useLocation();
    const postId = search.split("=")[1];

    const { loading } = useQuery(GET_LIKES, {
        onCompleted(data) {
            setUserList(data.getPost.likes);
        },
        onError: raiseErrorToast(
            "Some error occured while getting the likes list"
        ),
        variables: { postId },
    });

    if (loading)
        return (
            <FlexContainer h="70vh" justify="center" align="center">
                <LoaderSvg />
            </FlexContainer>
        );

    return (
        <PageContainer>
            <UserList userList={userList} />
        </PageContainer>
    );
}
