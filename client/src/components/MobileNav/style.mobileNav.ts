import styled from "styled-components";
import { media } from "../Shared/mediaQueries";
import { FlexContainer } from "../Shared";

export const MobileNavContainer = styled(FlexContainer)`
    ${media.custom(800)} {
        display: none;
    }
`;
