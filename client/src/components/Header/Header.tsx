import { useState } from "react";
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
    const [searchQuery, setSearchQuery] = useState("");
    const { pathname } = useLocation();

    function searchVideos() {
        if (searchQuery.trim().length > 0) {
            navigate(`/search?query=${searchQuery}`);
        }
    }

    return pathname !== "/landing" &&
        pathname !== "/login" &&
        pathname !== "/signup" ? (
        <HeaderContainer
            as="header"
            justify="space-between"
            align="center"
            h="5em"
            mb="1.5em"
            position="sticky"
            top="0"
            bgc="var(--card-color)"
            zIndex="var(--z-index-2)"
        >
            <Link to="/">
                <FlexContainer align="center">
                    <Image src={logo} alt="" h="2em" />
                    <Logo fw={600} ml="1em">
                        ReadersStash
                    </Logo>
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
                    value={searchQuery}
                    onChange={(e: InputEvent) => setSearchQuery(e.target.value)}
                    onKeyPress={(e: KeyboardEvent) => {
                        if (e.key === "Enter") searchVideos();
                    }}
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
                cursor="pointer"
                onClick={() => navigate("/newpost")}
            >
                <AddPostSvg className="scale-13" color="var(--font-color)" />
                <Container ml="0.5em">New Post</Container>
            </AddPostButtonContainer>
        </HeaderContainer>
    ) : null;
}
