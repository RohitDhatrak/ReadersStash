import { useState } from "react";
import { useQuery } from "@apollo/client";
import { User } from "../../../types";
import { useAppSelector } from "../../../app/hooks";
import { UserList } from "../../../components";
import { GET_FOLLOWING } from "../../../graphql/queries";
import { getUser } from "../userSlice";
import { PageContainer } from "./style.following";
import { raiseErrorToast } from "../../../utils/toast";

export function Following() {
    const user = useAppSelector(getUser);
    const [userList, setUserList] = useState<Array<User>>([]);

    useQuery(GET_FOLLOWING, {
        onCompleted(data) {
            setUserList(data.getUser.following);
        },
        onError: raiseErrorToast(
            "Some error occured while getting the following list"
        ),
        variables: { userName: user.userName },
    });

    return (
        <PageContainer>
            <UserList userList={userList} />
        </PageContainer>
    );
}
