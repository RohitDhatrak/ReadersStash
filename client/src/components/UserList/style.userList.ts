import styled, { css } from "styled-components";
import { Container, Image } from "../Shared";

type ImageDivProps = {
    bgImg: string;
};

export const ImageContainer = styled(Container)`
    height: 4.5em 
    max-width: 4.5em;
    text-align: center;
`;

export const ImageDiv = styled(Image)<ImageDivProps>`
    width: 4.5em;
    height: 4.5em;
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
