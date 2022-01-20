import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { User, Post } from "../../types";
import { liked, unliked } from "../posts/postsSlice";

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
    followersCount: 0,
    following: [],
    followingCount: 0,
    posts: [],
    liked: [],
    bookmarked: [],
    likesHashMap: {},
    bookmarksHashMap: {},
    followingHashMap: {},
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
        bookmark(state, action: PayloadAction<Post>) {
            if (state?.bookmarked) {
                state.bookmarked.push(action.payload);
                state.bookmarksHashMap[action.payload._id] = true;
            }
        },
        removeBookmark(state, action: PayloadAction<Post>) {
            if (state?.bookmarked) {
                state.bookmarked = state.bookmarked.filter(
                    (post) => post._id !== action.payload._id
                );
                delete state.bookmarksHashMap[action.payload._id];
            }
        },
        followed(state, action: PayloadAction<User>) {
            if (state?.followingCount !== undefined) state.followingCount++;
            state.followingHashMap[action.payload._id] = true;
        },
        unfollowed(state, action: PayloadAction<User>) {
            if (state?.followingCount !== undefined) state.followingCount--;
            delete state.followingHashMap[action.payload._id];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(liked, (state, action) => {
            if (state?.liked) {
                state.liked.push(action.payload);
                state.likesHashMap[action.payload._id] = true;
            }
        });
        builder.addCase(unliked, (state, action) => {
            if (state?.liked) {
                state.liked = state.liked.filter(
                    (post) => post._id !== action.payload._id
                );
                delete state.likesHashMap[action.payload._id];
            }
        });
    },
});

export const getUser = (state: RootState) => state.user;

export default userSlice.reducer;

export const {
    login,
    profileLoaded,
    bookmark,
    removeBookmark,
    followed,
    unfollowed,
} = userSlice.actions;
