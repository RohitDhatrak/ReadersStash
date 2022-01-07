import styled from "styled-components";
import { media } from "../Shared/mediaQueries";
import { FlexContainer } from "../Shared";

export const SidePannelContainer = styled(FlexContainer)`
    display: none;
    ${media.desktop} {
        display: block;
    }
`;
