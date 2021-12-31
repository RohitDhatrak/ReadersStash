import { InputEvent } from "../types";

export function validatePassword(
    e: InputEvent,
    isRetyped: boolean,
    setErrorMessage: Function,
    setRetypedPassword: Function,
    setPassword: Function,
    password: string
) {
    var regularExpression =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    setErrorMessage("");

    if (password !== e.target.value) {
        setErrorMessage("Passwords do not match");
    }

    if (isRetyped) {
        setRetypedPassword(e.target.value);
        if (!regularExpression.test(password)) {
            setErrorMessage(
                "The password should be 6-16 characters and should contain atleast 1 number & 1 special character"
            );
        }
    } else {
        setPassword(e.target.value);
        if (!regularExpression.test(e.target.value)) {
            setErrorMessage(
                "The password should be 6-16 characters and should contain atleast 1 number & 1 special character"
            );
        }
    }
}
