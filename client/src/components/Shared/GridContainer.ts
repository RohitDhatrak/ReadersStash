import styled, { css } from "styled-components";
import { ContainerCommonProps, CommonContainer } from "./CommonContainer";

type GridContainerProps = ContainerCommonProps & {
    display?: "grid";
    justify?: "center" | "baseline" | "space-between" | "space-around";
    align?: "center" | "baseline";
    gap?: string;
};

export const GridContainer = styled(CommonContainer)<GridContainerProps>`
    display: ${(props) => (props.display ? props.display : "grid")};

    ${(props) =>
        props.justify &&
        css`
            justify-content: ${() => props.justify};
        `}
    ${(props) =>
        props.align &&
        css`
            align-items: ${() => props.align};
        `}
    ${(props) =>
        props.gap &&
        css`
            grid-gap: ${() => props.gap};
        `}
`;
