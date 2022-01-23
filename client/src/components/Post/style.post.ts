import styled, { css } from "styled-components";
import { Container } from "../Shared";

type ImageDivProps = {
    bgImg: string;
};

export const ImageContainer = styled(Container)`
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
