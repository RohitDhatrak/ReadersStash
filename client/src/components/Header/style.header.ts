import styled from "styled-components";
import { media } from "../Shared/mediaQueries";
import { FlexContainer, Container, Input } from "../Shared";

export const HeaderContainer = styled(FlexContainer)`
    justify-content: space-around;
    padding: 0.5em 1em;
    ${media.custom(800)} {
        justify-content: space-between;
        padding: 0.5em 2em;
    }
    ${media.tablet} {
    }
    ${media.largeTablet} {
    }
    ${media.desktop} {
    }
`;

export const AddPostButtonContainer = styled(FlexContainer)`
    display: none;
    ${media.custom(800)} {
        display: flex;
    }
`;

export const SearchContainer = styled(Input)`
    width: 65vw;
    ${media.custom(800)} {
        display: block;
        width: 40vw;
    }
`;

export const Logo = styled(Container)`
    display: none;
    ${media.custom(800)} {
        font-size: 1rem;
        display: block;
    }
    ${media.tablet} {
        font-size: 1.25rem;
    }
    ${media.largeTablet} {
        font-size: 1.4rem;
    }
    ${media.desktop} {
    }
`;
