import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Post } from "../../types";

const initialState: Array<Post> = [];

export const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        loaded(state, action: PayloadAction<Array<Post>>) {
            return [...state, ...action.payload];
        },
        added(state, action: PayloadAction<Post>) {
            state.push(action.payload);
        },
        liked(state, action: PayloadAction<Post>) {
            const index = state.findIndex(
                (post) => post._id === action.payload._id
            );
            if (index !== -1) {
                state[index].likesCount++;
            }
        },
        unliked(state, action: PayloadAction<Post>) {
            const index = state.findIndex(
                (post) => post._id === action.payload._id
            );
            if (index !== -1) {
                state[index].likesCount--;
            }
        },
    },
});

export const getPosts = (state: RootState) => state.posts;

export default postsSlice.reducer;

export const { loaded, added, liked, unliked } = postsSlice.actions;
