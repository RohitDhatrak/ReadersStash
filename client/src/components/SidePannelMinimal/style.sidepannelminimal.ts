import styled from "styled-components";
import { media } from "../Shared/mediaQueries";
import { FlexContainer } from "../Shared";

export const SidePannelMinimalContainer = styled(FlexContainer)`
    display: none;
    ${media.custom(800)} {
        display: block;
    }
    ${media.desktop} {
        display: none;
    }
`;
