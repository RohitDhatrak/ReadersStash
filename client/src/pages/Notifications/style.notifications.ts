import styled, { css } from "styled-components";
import { media } from "../../components/Shared/mediaQueries";
import { FlexContainer, Container } from "../../components/Shared";

type ImageDivProps = {
    bgImg: string;
};

export const PageContainer = styled(FlexContainer)`
    margin-left: 0;
    ${media.custom(800)} {
        margin-left: 7em;
    }
`;

export const ImageContainer = styled(Container)`
    height: 4em 
    max-width: 4em;
    text-align: center;
`;

export const ImageDiv = styled(Container)<ImageDivProps>`
    width: 3.5em;
    height: 3.5em;
    display: inline-block;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    ${(props) =>
        props.bgImg &&
        css`
            background-image: ${() => props.bgImg};
        `}
`;
