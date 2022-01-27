import { Link, useLocation } from "react-router-dom";
import { FlexContainer, Container } from "../Shared";
import { SidePannelMinimalContainer } from "./style.sidepannelminimal";
import {
    HomeSvg,
    SettingsSvg,
    ExploreSvg,
    NotificationSvg,
    ProfileSvg,
} from "../../assets/svg";
import { useAppSelector } from "../../app/hooks";
import { getUser } from "../../features/user/userSlice";

export function SidePannelMinimal({ unreadCount }: { unreadCount: number }) {
    const { pathname } = useLocation();
    const user = useAppSelector(getUser);
    const isProfile = pathname.split("/")[1] === user?.userName;

    return pathname !== "/landing" &&
        pathname !== "/login" &&
        pathname !== "/signup" ? (
        <SidePannelMinimalContainer
            as="nav"
            position="fixed"
            direction="column"
            w="7em"
            bgc="var(--nav-color)"
            h="100vh"
        >
            <Link to="/">
                <FlexContainer
                    br="1em"
                    w="100%"
                    direction="column"
                    justify="center"
                    align="center"
                    cursor="pointer"
                    textAlign="center"
                    fs="0.9rem"
                    p="1em 0"
                    bgc={pathname === "/" ? "var(--nav-hover-color)" : ""}
                    hover="background-color: var(--nav-hover-color)"
                >
                    <HomeSvg color={"var(--font-color)"} className="scale-13" />
                    <Container mt="0.5em">Home</Container>
                </FlexContainer>
            </Link>

            <Link to="/explore">
                <FlexContainer
                    br="1em"
                    w="100%"
                    direction="column"
                    justify="center"
                    align="center"
                    cursor="pointer"
                    textAlign="center"
                    fs="0.9rem"
                    p="1em 0"
                    bgc={
                        pathname === "/explore" ? "var(--nav-hover-color)" : ""
                    }
                    hover="background-color: var(--nav-hover-color)"
                >
                    <ExploreSvg
                        color={"var(--font-color)"}
                        className="scale-14"
                    />
                    <Container mt="0.5em">Explore</Container>
                </FlexContainer>
            </Link>

            <Link to="/notifications">
                <FlexContainer
                    br="1em"
                    w="100%"
                    direction="column"
                    justify="center"
                    align="center"
                    cursor="pointer"
                    textAlign="center"
                    fs="0.9rem"
                    p="1em 0"
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
                    <Container mt="0.5em">Notifications</Container>
                </FlexContainer>
            </Link>

            <Link to={`/${user?.userName}`}>
                <FlexContainer
                    br="1em"
                    w="100%"
                    direction="column"
                    justify="center"
                    align="center"
                    cursor="pointer"
                    textAlign="center"
                    fs="0.9rem"
                    p="1em 0"
                    bgc={isProfile ? "var(--nav-hover-color)" : ""}
                    hover="background-color: var(--nav-hover-color)"
                >
                    <ProfileSvg
                        color={"var(--font-color)"}
                        className="scale-13"
                    />
                    <Container mt="0.5em">Profile</Container>
                </FlexContainer>
            </Link>

            <Link to="/settings">
                <FlexContainer
                    br="1em"
                    w="100%"
                    direction="column"
                    justify="center"
                    align="center"
                    cursor="pointer"
                    textAlign="center"
                    fs="0.9rem"
                    p="1em 0"
                    bgc={
                        pathname === "/watchlater"
                            ? "var(--nav-hover-color)"
                            : ""
                    }
                    hover="background-color: var(--nav-hover-color)"
                >
                    <SettingsSvg
                        color={"var(--font-color)"}
                        className="scale-14"
                    />
                    <Container mt="0.5em">Settings</Container>
                </FlexContainer>
            </Link>
        </SidePannelMinimalContainer>
    ) : null;
}
