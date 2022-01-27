import { Link, useLocation } from "react-router-dom";
import { FlexContainer, Container } from "../Shared";
import { SidePannelContainer } from "./style.sidepannel";
import {
    HomeSvg,
    SettingsSvg,
    ExploreSvg,
    NotificationSvg,
    ProfileSvg,
} from "../../assets/svg";
import { useAppSelector } from "../../app/hooks";
import { getUser } from "../../features/user/userSlice";

export function SidePannel({ unreadCount }: { unreadCount: number }) {
    const { pathname } = useLocation();
    const user = useAppSelector(getUser);
    const isProfile = pathname.split("/")[1] === user?.userName;

    return pathname !== "/landing" &&
        pathname !== "/login" &&
        pathname !== "/signup" ? (
        <SidePannelContainer
            as="nav"
            position="fixed"
            direction="column"
            w="15em"
            h="100vh"
            ml="1.1em"
        >
            <Link to="/">
                <FlexContainer
                    br="1em"
                    mb="0.5em"
                    w="100%"
                    p="0.8em 2.1em"
                    cursor="pointer"
                    bgc={pathname === "/" ? "var(--nav-hover-color)" : ""}
                    hover="background-color: var(--nav-hover-color)"
                >
                    <HomeSvg color={"var(--font-color)"} className="scale-13" />
                    <Container ml="2em">Home</Container>
                </FlexContainer>
            </Link>

            <Link to="/explore">
                <FlexContainer
                    br="1em"
                    mb="0.5em"
                    w="100%"
                    p="0.8em 2.1em"
                    cursor="pointer"
                    bgc={
                        pathname === "/explore" ? "var(--nav-hover-color)" : ""
                    }
                    hover="background-color: var(--nav-hover-color)"
                >
                    <ExploreSvg
                        color={"var(--font-color)"}
                        className="scale-13"
                    />
                    <Container ml="2em">Explore</Container>
                </FlexContainer>
            </Link>

            <Link to="/notifications">
                <FlexContainer
                    br="1em"
                    mb="0.5em"
                    w="100%"
                    p="0.8em 2.1em"
                    cursor="pointer"
                    bgc={
                        pathname === "/notifications"
                            ? "var(--nav-hover-color)"
                            : ""
                    }
                    hover="background-color: var(--nav-hover-color)"
                >
                    <Container position="relative">
                        {unreadCount > 0 && (
                            <FlexContainer
                                align="center"
                                justify="center"
                                textAlign="center"
                                fs="0.7rem"
                                top="-1em"
                                right="-1em"
                                position="absolute"
                                p="0.2em 0.5em"
                                w="1.8em"
                                zIndex="1"
                                br="50%"
                                bgc="var(--notification-color)"
                            >
                                {unreadCount}
                            </FlexContainer>
                        )}
                        <NotificationSvg
                            color={"var(--font-color)"}
                            className="scale-15"
                        />
                    </Container>
                    <Container ml="2em">Notifications</Container>
                </FlexContainer>
            </Link>

            <Link to={`/${user?.userName}`}>
                <FlexContainer
                    br="1em"
                    mb="0.5em"
                    w="100%"
                    p="0.8em 2.1em"
                    cursor="pointer"
                    bgc={isProfile ? "var(--nav-hover-color)" : ""}
                    hover="background-color: var(--nav-hover-color)"
                >
                    <ProfileSvg
                        color={"var(--font-color)"}
                        className="scale-12"
                    />
                    <Container ml="2em">Profile</Container>
                </FlexContainer>
            </Link>

            <Link to="/settings">
                <FlexContainer
                    br="1em"
                    mb="0.5em"
                    w="100%"
                    p="0.8em 2em"
                    cursor="pointer"
                    bgc={
                        pathname === "/settings" ? "var(--nav-hover-color)" : ""
                    }
                    hover="background-color: var(--nav-hover-color)"
                >
                    <SettingsSvg
                        color={"var(--font-color)"}
                        className="scale-13"
                    />
                    <Container ml="2em">Settings</Container>
                </FlexContainer>
            </Link>
        </SidePannelContainer>
    ) : null;
}
