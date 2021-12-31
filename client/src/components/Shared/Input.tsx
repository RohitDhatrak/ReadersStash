import styled from "styled-components";
import { ContainerCommonProps, CommonContainer } from "./CommonContainer";

type InputProps = ContainerCommonProps & {};

const InputStyledComponent = styled(CommonContainer)<InputProps>``;

export function Input({ ...props }) {
    return <InputStyledComponent as="input" {...props} />;
}
