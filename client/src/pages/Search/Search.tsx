import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useMediaQuery } from "react-responsive";
import { Search as SearchType, Post as PostType } from "../../types";
import { FlexContainer, Container } from "../../components/Shared";
import { PageContainer } from "./style.search";
import { LoaderSvg, PostSvg, ProfileSvg, EmptyPageSvg } from "../../assets/svg";
import { UserList, Post } from "../../components";
import { GET_SEARCH_RESULTS } from "../../graphql/queries";
import { raiseErrorToast } from "../../utils/toast";

export function Search() {
    const { search = "" } = useLocation();
    const [searchResults, setSearchResults] = useState<SearchType>({
        users: [],
        posts: [],
    });
    const [selectedSection, setSelectedSection] = useState<"users" | "posts">(
        "users"
    );
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 600px)" });
    const query = decodeURIComponent(search.split("=")[1]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { loading } = useQuery(GET_SEARCH_RESULTS, {
        onCompleted(data) {
            setSearchResults(data.getSearchResults);
        },
        onError: raiseErrorToast(
            "Couldn't load your search results, please try again later"
        ),
        variables: { query },
    });

    if (loading)
        return (
            <FlexContainer h="70vh" justify="center" align="center">
                <LoaderSvg />
            </FlexContainer>
        );

    return (
        <PageContainer direction="column">
            <FlexContainer
                gap="3em"
                maxW="80vw"
                m="0 auto"
                p={isTabletOrMobile ? "1em 0.5em" : "1em 2em"}
            >
                <FlexContainer
                    onClick={() => setSelectedSection("users")}
                    direction="column"
                    cursor="pointer"
                >
                    <FlexContainer
                        as="button"
                        b="none"
                        bgc="transparent"
                        fs="1rem"
                        align="center"
                        gap="0.5em"
                    >
                        {!isTabletOrMobile && (
                            <ProfileSvg
                                fill="none"
                                color="var(--font-color)"
                                strokeWidth={5}
                            />
                        )}
                        <Container>People</Container>
                    </FlexContainer>
                    {selectedSection === "users" && (
                        <Container
                            bgc="var(--secondary-color)"
                            h="0.25em"
                            color="transparent"
                            mt="0.2em"
                        >
                            .
                        </Container>
                    )}
                </FlexContainer>
                <FlexContainer
                    onClick={() => setSelectedSection("posts")}
                    direction="column"
                    cursor="pointer"
                >
                    <FlexContainer
                        as="button"
                        b="none"
                        bgc="transparent"
                        fs="1rem"
                        align="center"
                        gap="0.5em"
                    >
                        {!isTabletOrMobile && (
                            <PostSvg color="var(--font-color)" />
                        )}
                        <Container>Posts</Container>
                    </FlexContainer>
                    {selectedSection === "posts" && (
                        <Container
                            bgc="var(--secondary-color)"
                            h="0.25em"
                            color="transparent"
                            mt="0.2em"
                        >
                            .
                        </Container>
                    )}
                </FlexContainer>
            </FlexContainer>
            <FlexContainer direction="column" align="center" mt="1em">
                {selectedSection === "posts" &&
                    searchResults.posts.map((post: PostType) => (
                        <Post post={post} key={post._id} />
                    ))}
                {selectedSection === "users" && (
                    <UserList
                        userList={searchResults.users}
                        showEmptyPage={false}
                    />
                )}
                {searchResults?.[selectedSection]?.length === 0 && (
                    <FlexContainer
                        direction="column"
                        align="center"
                        justify="center"
                        h="50vh"
                        maxW="90vw"
                    >
                        <EmptyPageSvg height="13em" />
                        <Container fs="1.2rem" mt="1em" textAlign="center">
                            We couldn't find anything :(
                        </Container>
                    </FlexContainer>
                )}
            </FlexContainer>
        </PageContainer>
    );
}
