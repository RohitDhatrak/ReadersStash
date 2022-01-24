import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { User } from "../../../types";
import { UserList } from "../../../components";
import { GET_FOLLOWERS } from "../../../graphql/queries";
import { PageContainer } from "./style.followers";
import { raiseErrorToast } from "../../../utils/toast";
import { LoaderSvg } from "../../../assets/svg";
import { FlexContainer } from "../../../components/Shared";

export function Followers() {
    const [userList, setUserList] = useState<Array<User>>([]);
    const { search = "" } = useLocation();
    const userId = search.split("=")[1];

    const { loading, refetch } = useQuery(GET_FOLLOWERS, {
        onCompleted(data) {
            setUserList(data.getUser.followers);
        },
        onError: raiseErrorToast(
            "Some error occured while getting the followers list"
        ),
        variables: { userId },
    });

    useEffect(() => {
        refetch();
    }, []);

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
