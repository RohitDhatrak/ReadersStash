import { useNavigate } from "react-router-dom";
import { FlexContainer, Container, Image } from "../../components/Shared";
import { ActionButton } from "../../components";
import { HeroImageSvg } from "../../assets/svg";
import {
    LandingPageContainer,
    ImageContainer,
    HeadingContainer,
    LogoContainer,
    HeaderButtonContainer,
} from "./style.landingpage";
import logo from "../../assets/logo.png";

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <FlexContainer direction="column" minH="90vh" mb="2em" bgc="#EBF1F4">
            <FlexContainer
                as="header"
                justify="space-between"
                w="60em"
                maxW="88%"
                m="1em auto"
                mb="2em"
            >
                <FlexContainer
                    align="center"
                    onClick={() => navigate("/", { replace: true })}
                    cursor="pointer"
                >
                    <Image src={logo} w="2em" mr="1em" />
                    <LogoContainer fs="1.5rem" fw={600}>
                        ReadersStash
                    </LogoContainer>
                </FlexContainer>
                <Container>
                    <Container
                        as="button"
                        fs="1rem"
                        h="2.5em"
                        br="0.4em"
                        b="none"
                        color="var(--secondary-color)"
                        bgc="#fff"
                        fw={600}
                        cursor="pointer"
                        p="0.5em 1em"
                        mr="1em"
                        onClick={() => navigate("/login", { replace: true })}
                    >
                        Login
                    </Container>
                    <HeaderButtonContainer
                        as="button"
                        fs="1rem"
                        h="2.5em"
                        br="0.4em"
                        b="none"
                        bgc="var(--secondary-color)"
                        color="#e9e6e6"
                        fw={600}
                        cursor="pointer"
                        p="0.5em 1em"
                        onClick={() => navigate("/signup", { replace: true })}
                    >
                        Get Started
                    </HeaderButtonContainer>
                </Container>
            </FlexContainer>

            <LandingPageContainer>
                <FlexContainer direction="column">
                    <HeadingContainer>
                        Bite-sized knowledge to learn on the go
                    </HeadingContainer>
                    <Container fs="1.2rem" mt="1em" mb="1em">
                        Share Ideas from books, articles, & podcasts
                    </Container>
                    <ActionButton
                        w="10em"
                        onClick={() => navigate("/signup", { replace: true })}
                    >
                        Get Started
                    </ActionButton>
                </FlexContainer>
                <ImageContainer>
                    <HeroImageSvg />
                </ImageContainer>
            </LandingPageContainer>
        </FlexContainer>
    );
}
