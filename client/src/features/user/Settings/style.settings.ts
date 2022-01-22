import styled from "styled-components";
import { media } from "../../../components/Shared/mediaQueries";
import { FlexContainer, Container } from "../../../components/Shared";

export const PageContainer = styled(FlexContainer)`
    margin-left: 0;
    ${media.custom(800)} {
        margin-left: 7em;
    }
`;

export const ImageContainer = styled(Container)`
    width: 7em;
    height: 7em;
    margin: 0 auto;
    ${media.custom(800)} {
        width: 10em;
        height: 10em;
    }
`;
