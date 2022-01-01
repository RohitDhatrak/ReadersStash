import styled from "styled-components";
import { media } from "../../components/Shared/mediaQueries";
import { FlexContainer, Container } from "../../components/Shared";

export const LandingPageContainer = styled(FlexContainer)`
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    margin: auto;
    max-width: 80%;
    width: 60em;
    ${media.largeTablet} {
        flex-direction: row;
    }
`;

export const ImageContainer = styled(Container)`
    width: 20em;
    max-width: 90vw;
    margin-bottom: 2em;
    ${media.largeTablet} {
        width: 30em;
    }
    ${media.desktop} {
        width: 35em;
    }
`;

export const HeadingContainer = styled(Container)`
    font-size: 2em;
    font-weight: 600;
    ${media.tablet} {
        font-size: 2.5em;
    }
`;

export const LogoContainer = styled(Container)`
    font-size: 1.1rem;
    ${media.tablet} {
        font-size: 1.5em;
    }
`;

export const HeaderButtonContainer = styled(Container)`
    display: none;
    ${media.tablet} {
        display: inline;
    }
`;
