import styled, { css } from "styled-components";
import { ContainerCommonProps, CommonContainer } from "./CommonContainer";

type ImageProps = ContainerCommonProps & {
    objectFit?: "cover";
};

const ImageStyledComponent = styled(CommonContainer)<ImageProps>`
    ${(props) =>
        props.objectFit &&
        css`
            object-fit: ${() => props.objectFit};
        `}
`;

export function Image({ ...props }) {
    return <ImageStyledComponent {...props} as="img"></ImageStyledComponent>;
}
