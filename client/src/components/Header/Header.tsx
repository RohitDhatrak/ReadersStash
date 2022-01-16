import { Link, useNavigate, useLocation } from "react-router-dom";
import { AddPostSvg } from "../../assets/svg";
import { FlexContainer, Image, Container } from "../Shared";
import {
    HeaderContainer,
    AddPostButtonContainer,
    SearchContainer,
    Logo,
} from "./style.header";
import logo from "../../assets/logo.png";
import { InputEvent } from "../../types";

export function Header() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return pathname !== "/landing" &&
        pathname !== "/login" &&
        pathname !== "/signup" ? (
        <HeaderContainer
            as="header"
            justify="space-between"
            align="center"
            h="5em"
            mb="2em"
            position="sticky"
            top="0"
            bgc="var(--card-color)"
            zIndex="var(--z-index-2)"
        >
            <Link to="/">
                <FlexContainer align="center">
                    <Image src={logo} alt="" mr="1em" h="2em" />
                    <Logo fw={600}>ReadersStash</Logo>
                </FlexContainer>
            </Link>

            <FlexContainer>
                <SearchContainer
                    bgc="var(--bg-color)"
                    fs="1rem"
                    h="2.5em"
                    br="1em"
                    b="none"
                    p="1em"
                    placeholder={"Search for content or users."}
                />
            </FlexContainer>
            <AddPostButtonContainer
                as="button"
                fs="1rem"
                h="2.5em"
                br="2em"
                b="none"
                align="center"
                p="1em"
                fw={600}
                bgc="var(--primary-color)"
            >
                <AddPostSvg className="scale-13" />
                <Link to="/newpost">
                    <Container ml="0.5em">New Post</Container>
                </Link>
            </AddPostButtonContainer>
        </HeaderContainer>
    ) : null;
}
