import styled from "styled-components";
import { ContainerCommonProps, CommonContainer } from "./CommonContainer";

type ImageProps = ContainerCommonProps & {};

const ImageStyledComponent = styled(CommonContainer)<ImageProps>``;

export function Image({ ...props }) {
    return <ImageStyledComponent {...props} as="img"></ImageStyledComponent>;
}
