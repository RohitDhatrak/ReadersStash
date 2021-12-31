export interface Post {
    _id: string;
    title: string;
    body: string;
    user: User;
    likes: Array<User>;
    bookmarks: Array<User>;
    comments: Array<Comment>;
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
    following?: Array<User>;
    posts?: Array<Post>;
    liked?: Array<Post>;
    bookmarked?: Array<Post>;
}

export interface Comment {
    _id: string;
    body: string;
    user: User;
    likes: Array<User>;
    replies: Array<Comment>;
    parentComment: Comment;
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
