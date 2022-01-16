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
            return [action.payload, ...state];
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
        remove(state, action: PayloadAction<Post>) {
            return state.filter((post) => post._id !== action.payload._id);
        },
    },
});

export const getPosts = (state: RootState) => state.posts;

export default postsSlice.reducer;

export const { loaded, added, liked, unliked, remove } = postsSlice.actions;
