import { useState } from "react";
import { useQuery } from "@apollo/client";
import { User } from "../../../types";
import { useAppSelector } from "../../../app/hooks";
import { UserList } from "../../../components";
import { GET_FOLLOWERS } from "../../../graphql/queries";
import { getUser } from "../userSlice";
import { PageContainer } from "./style.followers";
import { raiseErrorToast } from "../../../utils/toast";

export function Followers() {
    const user = useAppSelector(getUser);
    const [userList, setUserList] = useState<Array<User>>([]);

    useQuery(GET_FOLLOWERS, {
        onCompleted(data) {
            setUserList(data.getUser.followers);
        },
        onError: raiseErrorToast(
            "Some error occured while getting the followers list"
        ),
        variables: { userName: user.userName },
    });

    return (
        <PageContainer>
            <UserList userList={userList} />
        </PageContainer>
    );
}
