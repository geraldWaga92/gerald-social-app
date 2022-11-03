import express  from "express";
const app = express();
import usersRoutes from './routes/users.js';
import postsRoutes from './routes/posts.js';
import likesRoutes from './routes/likes.js';
import commentsRoutes from './routes/comments.js';
import authRoutes from './routes/auths.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import multer from "multer";


//middlewares

//we need this line because we are using 'withCredentials: true', we just allow the our cookies in our application
//this is important and we'll get an error if we use withCredential without this line
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true)
    next();//means continue our operations
})
//this is important because we cannot send json data into our browser if we dont have this 
app.use(express.json())
//here we need to specify in our client side to port number in order to allow the CORS policy in our app 
app.use(cors({
    origin: 'http://localhost:3000',
    }
));
//this is important to add here if we use cookies so that our browser cookies will be analized bu the our cookie parser
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

//---- end of middlewares ---


//this all our endpoint in routes
app.use('/api/users', usersRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/likes', likesRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/auth', authRoutes)


//just add 4000 to successfully connect with the client
app.listen(5000 || 4000, () => {
    console.log('api successfully connected');
})