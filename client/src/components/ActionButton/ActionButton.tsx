import { Container } from "../Shared";

type ActionButtonPropTypes = {
    children: string;
    onClick?: React.MouseEventHandler;
    w?: string;
    m?: string;
    disabled?: boolean;
};

export function ActionButton({
    children,
    onClick,
    w = "100%",
    m,
    ...props
}: ActionButtonPropTypes) {
    return (
        <Container
            as="button"
            onClick={onClick}
            w={w}
            m={m}
            fs="1rem"
            h="2.5em"
            br="0.4em"
            b="none"
            bgc="var(--primary-color)"
            fw={600}
            cursor="pointer"
            {...props}
        >
            {children}
        </Container>
    );
}
