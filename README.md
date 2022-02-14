[![Netlify Status](https://api.netlify.com/api/v1/badges/772a1599-4ce0-41b2-a705-314ee4dd1325/deploy-status)](https://app.netlify.com/sites/readers-stash/deploys)

### About
ReadersStash is a social media app to share ideas from books, articles, & podcasts.

### Preview
![](/client/public/readers-stash.gif)

### Tech Stack
Frontend: React, Redux, Typescript, GraphQL (Apollo client), styled-components

Backend: GraphQL (Apollo Server), MongoDB, mongoose, Cloudinary, flexsearch, jsonwebtoken, bcrypt

### Features
- Create/Delete a Post
- Like and bookmark a post
- Comment on a post, reply to comments
- Share a post
- Explore section to find new people and content
- Near-real-time notifications for likes, comments, replies and follows
   - currently uses short polling at a frequency of 5 seconds
   - Optimized to avoid redundacy in payload transfer i.e sends a response payload only if the response has changed
- Get users and posts by search query (done using flexsearch)
- User profile with bio, profile picture, follow/following count, displays previous posts and liked posts
- Edit bio, profile pic, change password
- JWT based authentication

### Additonal Things
- Fully responsive
- Tested for contrast issues
- All interactive elements are keyboard accessible

### Things I want to improve/explore further
- Response based polling to avoid redundancy and exponential backoff to avoid spamming server in case of down time.
- Improve performance by adding infinite scrolling and virtualization

### Connect With Me
- Twitter – [@rohit_dhatrak_](https://twitter.com/rohit_dhatrak_)
- LinkedIn – [/rohitdhatrak](https://www.linkedin.com/in/rohitdhatrak)
- Other Links – [/rohitdhatrak](https://rohitdhatrak.bio.link/)

