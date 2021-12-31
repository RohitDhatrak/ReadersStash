import styled, { css } from "styled-components";
import { ContainerCommonProps, CommonContainer } from "./CommonContainer";

type ContainerProps = ContainerCommonProps & {
    display?: "inline" | "inline-block" | "block";
};

export const Container = styled(CommonContainer)<ContainerProps>`
    ${(props) =>
        props.display &&
        css`
            display: ${() => props.display};
        `}
`;
