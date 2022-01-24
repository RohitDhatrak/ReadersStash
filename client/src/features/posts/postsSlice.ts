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
            state.map((post) => {
                if (post._id === action.payload._id) post.likesCount++;
                return post;
            });
        },
        unliked(state, action: PayloadAction<Post>) {
            state.map((post) => {
                if (post._id === action.payload._id) post.likesCount--;
                return post;
            });
        },
        remove(state, action: PayloadAction<Post>) {
            state = state.filter((post) => post._id !== action.payload._id);
        },
        commentAdded(state, action: PayloadAction<Post>) {
            state.map((post) => {
                if (post._id === action.payload._id) post.commentsCount++;
                return post;
            });
        },
        commentDeleted(state, action: PayloadAction<Post>) {
            state.map((post) => {
                if (post._id === action.payload._id) post.commentsCount--;
                return post;
            });
        },
    },
});

export const getPosts = (state: RootState) => state.posts;

export default postsSlice.reducer;

export const {
    loaded,
    added,
    liked,
    unliked,
    remove,
    commentAdded,
    commentDeleted,
} = postsSlice.actions;
