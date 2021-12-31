import styled, { css } from "styled-components";
import { ContainerCommonProps, CommonContainer } from "./CommonContainer";

type FlexContainerProps = ContainerCommonProps & {
    display?: "flex";
    justify?: "center" | "baseline" | "space-between" | "space-around";
    align?: "center" | "baseline";
    wrap?: "wrap";
    direction?: "column";
    gap?: string;
};

export const FlexContainer = styled(CommonContainer)<FlexContainerProps>`
    display: ${(props) => (props.display ? props.display : "flex")};

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
        props.wrap &&
        css`
            flex-wrap: ${() => props.wrap};
        `}
    ${(props) =>
        props.direction &&
        css`
            flex-direction: ${() => props.direction};
        `}
    ${(props) =>
        props.gap &&
        css`
            gap: ${() => props.gap};
        `}
`;
