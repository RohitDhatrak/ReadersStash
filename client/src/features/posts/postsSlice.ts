import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../../types";

const initialState: Array<Post> = [];

export const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        postsLoaded(state, action: PayloadAction<Array<Post>>) {
            return [...state, ...action.payload];
        },
        postAdded(state, action: PayloadAction<Post>) {
            state.push(action.payload);
        },
    },
});

export default postsSlice.reducer;

export const { postsLoaded, postAdded } = postsSlice.actions;
