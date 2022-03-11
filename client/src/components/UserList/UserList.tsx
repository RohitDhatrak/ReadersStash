import { FlexContainer, Container } from "../../components/Shared";
import { User } from "../../types";
import { EmptyPageSvg } from "../../assets/svg";
import { UserBlock } from "./UserBlock";

export function UserList({
    userList,
    showEmptyPage = true,
}: {
    userList: Array<User>;
    showEmptyPage?: boolean;
}) {
    return (
        <FlexContainer direction="column" m="0 auto" w="40em" maxW="90vw">
            {[...userList]
                .reverse()
                .map((user) => (user ? <UserBlock user={user} /> : null))}
            {userList?.length === 0 && showEmptyPage && (
                <FlexContainer direction="column">
                    <EmptyPageSvg height="15em" />
                    <Container fs="1.4rem" mt="1em" textAlign="center">
                        Whoops! looks like there is nothing in here.
                    </Container>
                </FlexContainer>
            )}
        </FlexContainer>
    );
}
