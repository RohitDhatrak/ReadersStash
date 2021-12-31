import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FlexContainer, Container } from "../../components/Shared";

export function Page404() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <FlexContainer
            direction="column"
            align="center"
            justify="center"
            h="70vh"
        >
            <Container fs="6rem">404</Container>
            <Container fs="2rem">Page Not Found</Container>
            <FlexContainer
                direction="column"
                align="center"
                textAlign="center"
                m="1.5em"
            >
                We're sorry the page you requested could not be found
            </FlexContainer>
            <Link to="/">
                <Container
                    as="button"
                    fs="1.2rem"
                    p="0.5em 1em"
                    br="0.5em"
                    bgc="var(--primary-color)"
                    b="none"
                    cursor="pointer"
                >
                    Go to Home
                </Container>
            </Link>
        </FlexContainer>
    );
}
