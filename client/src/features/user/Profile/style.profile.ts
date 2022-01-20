import styled from "styled-components";
import { media } from "../../../components/Shared/mediaQueries";
import { FlexContainer, Container } from "../../../components/Shared";

export const PageContainer = styled(FlexContainer)`
    margin-left: 0;
    ${media.custom(800)} {
        margin-left: 7em;
    }
`;

export const DesktopProfileContainer = styled(Container)`
    display: none;
    margin-top: 1em;
    font-weight: 500;
    line-height: 1.5em;
    ${media.tablet} {
        display: block;
    }
`;

export const MobileProfileContainer = styled(Container)`
    display: block;
    margin: 0 auto;
    max-width: 80vw;
    margin-top: 1em;
    font-weight: 500;
    line-height: 1.5em;
    ${media.tablet} {
        display: none;
    }
`;

export const ImageContainer = styled(Container)`
    width: 7em;
    ${media.tablet} {
    }
    ${media.custom(800)} {
        width: 10em;
    }
    ${media.largeTablet} {
    }
    ${media.desktop} {
    }
`;
