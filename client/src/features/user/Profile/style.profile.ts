import styled, { css } from "styled-components";
import { media } from "../../../components/Shared/mediaQueries";
import { FlexContainer, Container, Image } from "../../../components/Shared";

type ImageDivProps = {
    bgImg: string;
};

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
    text-align: center;
`;

export const ImageDiv = styled(Image)<ImageDivProps>`
    display: inline-block;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    ${(props) =>
        props.bgImg &&
        css`
            background-image: ${() => props.bgImg};
        `}
    width: 5.5em;
    height: 5.5em;
    ${media.tablet} {
        width: 8em;
        height: 8em;
    }
    ${media.custom(800)} {
        width: 10em;
        height: 10em;
    }
`;
