interface HashMap {
    [key: string]: any;
}

export interface Post {
    _id: string;
    title: string;
    body: string;
    user: User;
    image?: string;
    likes: Array<User>;
    likesCount: number;
    bookmarks: Array<User>;
    comments: Array<Comment>;
    commentsCount: number;
    topics: Array<Topic>;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    _id: string;
    email?: string;
    userName: string;
    name: string;
    jwt: string;
    profilePicture: string;
    bio?: string;
    location?: string;
    url?: string;
    followers?: Array<User>;
    followersCount?: number;
    following?: Array<User>;
    followingCount?: number;
    posts?: Array<Post>;
    liked?: Array<Post>;
    bookmarked?: Array<Post>;
    likesHashMap: HashMap;
    bookmarksHashMap: HashMap;
    followingHashMap: HashMap;
}

export interface Comment {
    _id: string;
    body: string;
    user: User;
    likes: Array<User>;
    replies: Array<Comment>;
    level: number;
    parentComment: string;
    createdAt: string;
    updatedAt: string;
}

export interface Notification {
    _id: string;
    user: User;
    type: string;
    isRead: boolean;
    post: Post;
    createdAt: string;
    updatedAt: string;
}

export interface Topic {
    _id: string;
    name: string;
    posts: Array<Post>;
}

export type Children = { children: React.ReactElement };
export type InputEvent = React.ChangeEvent<HTMLInputElement>;
export type ButtonEvent =
    | React.MouseEvent<HTMLButtonElement>
    | React.MouseEvent<HTMLDivElement, MouseEvent>;
export type FormEvent = React.FormEvent;
export type TextAreaEvent = React.ChangeEvent<HTMLTextAreaElement>;
