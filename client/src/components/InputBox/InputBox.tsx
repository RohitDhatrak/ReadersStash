import { Input } from "../Shared";

type InputProps = {
    label: string;
    type: string;
    onChangeFunction: Function;
    placeholder?: string;
    value?: string;
};

export function InputBox({
    type,
    label,
    placeholder = label,
    onChangeFunction,
    value,
}: InputProps) {
    return (
        <>
            <label htmlFor="email">{label}</label>
            <Input
                type={type}
                id={label}
                value={value}
                placeholder={placeholder}
                onChange={onChangeFunction}
                bgc="transparent"
                b="1px solid var(--border-color)"
                h="2.8em"
                m="0.5em"
                p="1em"
                color="var(--font-color)"
                fs="1rem"
                br="0.4em"
            />
        </>
    );
}
