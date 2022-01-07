import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { User } from "../../types";

const initialState: User = {
    _id: "",
    email: "",
    userName: "",
    name: "",
    jwt: "",
    profilePicture: "",
    bio: "",
    location: "",
    url: "",
    followers: [],
    following: [],
    posts: [],
    liked: [],
    bookmarked: [],
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login(state, action: PayloadAction<User>) {
            return { ...state, ...action.payload };
        },
        profileLoaded(state, action: PayloadAction<User>) {
            return { ...state, ...action.payload };
        },
    },
});

export const getUser = (state: RootState) => state.user;

export default userSlice.reducer;

export const { login, profileLoaded } = userSlice.actions;
