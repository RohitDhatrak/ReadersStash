import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { User } from "../../../types";
import { useAppSelector } from "../../../app/hooks";
import { UserList } from "../../../components";
import { GET_LIKES } from "../../../graphql/queries";
import { getUser } from "../../user/userSlice";
import { PageContainer } from "./style.likes";
import { raiseErrorToast } from "../../../utils/toast";

export function Likes() {
    const user = useAppSelector(getUser);
    const [userList, setUserList] = useState<Array<User>>([]);
    const { search = "" } = useLocation();
    const postId = search.split("?")[1];

    useQuery(GET_LIKES, {
        onCompleted(data) {
            setUserList(data.getPost.likes);
        },
        onError: raiseErrorToast(
            "Some error occured while getting the likes list"
        ),
        variables: { postId },
    });

    return (
        <PageContainer>
            <UserList userList={userList} />
        </PageContainer>
    );
}
