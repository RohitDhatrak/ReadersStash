import { Link } from "react-router-dom";
import { FlexContainer, Container } from "../Shared";
import {
    HomeSvg,
    ExploreSvg,
    NotificationSvg,
    ProfileSvg,
    AddPostSvg,
} from "../../assets/svg";
import { MobileNavContainer } from "./style.mobileNav";
import { useAppSelector } from "../../app/hooks";
import { getUser } from "../../features/user/userSlice";

export function MobileNav() {
    const user = useAppSelector(getUser);

    return (
        <MobileNavContainer
            as="nav"
            position="fixed"
            bottom="0"
            justify="space-around"
            w="100vw"
            bgc="var(--bg-color)"
            color="var(--font-color-2)"
            p="0.3em 0em"
            bt="2px solid var(--nav-hover-color)"
        >
            <Link to="/">
                <FlexContainer
                    direction="column"
                    pt="0.4em"
                    align="center"
                    cursor="pointer"
                >
                    <HomeSvg className="scale-12" color={"var(--font-color)"} />
                    <Container fs="0.8rem" pt="0.4em">
                        Home
                    </Container>
                </FlexContainer>
            </Link>
            <Link to="/explore">
                <FlexContainer
                    direction="column"
                    pt="0.4em"
                    align="center"
                    cursor="pointer"
                >
                    <ExploreSvg
                        color={"var(--font-color)"}
                        className="scale-13"
                    />
                    <Container fs="0.8rem" pt="0.4em">
                        Explore
                    </Container>
                </FlexContainer>
            </Link>
            <Link to="/newpost">
                <FlexContainer
                    direction="column"
                    pt="0.4em"
                    align="center"
                    cursor="pointer"
                >
                    <AddPostSvg
                        color={"var(--font-color)"}
                        className="scale-13"
                        strokeWidth="0"
                    />
                    <Container fs="0.8rem" pt="0.4em">
                        Post
                    </Container>
                </FlexContainer>
            </Link>
            <Link to="/notifications">
                <FlexContainer
                    direction="column"
                    pt="0.4em"
                    align="center"
                    cursor="pointer"
                >
                    <NotificationSvg
                        color={"var(--font-color)"}
                        className="scale-14"
                    />
                    <Container fs="0.8rem" pt="0.4em">
                        Updates
                    </Container>
                </FlexContainer>
            </Link>
            <Link to={`${user.userName}`}>
                <FlexContainer
                    direction="column"
                    pt="0.4em"
                    align="center"
                    cursor="pointer"
                >
                    <ProfileSvg
                        color={"var(--font-color)"}
                        className="scale-12"
                        strokeWidth="0"
                    />
                    <Container fs="0.8rem" pt="0.4em">
                        Profile
                    </Container>
                </FlexContainer>
            </Link>
        </MobileNavContainer>
    );
}
