import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { getUser } from "../../features/user/userSlice";

export function PrivateRoute({
    children,
    path,
}: {
    children: React.ReactElement;
    path: string;
}) {
    const user = useAppSelector(getUser);
    console.log(user);

    return user?._id ? (
        children
    ) : (
        <Navigate replace to="/landing" state={{ previousPath: `${path}` }} />
    );
}
