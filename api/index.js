import express  from "express";
const app = express();
import usersRoutes from './routes/users.js';
import postsRoutes from './routes/posts.js';
import likesRoutes from './routes/likes.js';
import commentsRoutes from './routes/comments.js';
import authRoutes from './routes/auths.js';
import cors from 'cors';
import cookieParser from "cookie-parser";


//middlewares
//this is important because we cannot send json data into our browser if we dont have this 
app.use(express.json())
app.use(cors());
app.use(cookieParser());

//this all our endpoint in routes
app.use('/api/users', usersRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/likes', likesRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/auth', authRoutes)


app.listen(5000, () => {
    console.log('api successfully connected');
})