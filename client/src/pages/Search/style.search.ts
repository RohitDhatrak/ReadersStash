import styled from "styled-components";
import { media } from "../../components/Shared/mediaQueries";
import { FlexContainer } from "../../components/Shared";

export const PageContainer = styled(FlexContainer)`
    margin-left: 0;
    ${media.custom(800)} {
        margin-left: 7em;
    }
`;
