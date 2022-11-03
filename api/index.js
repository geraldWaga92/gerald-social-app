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

//--our multer library --
const storage = multer.diskStorage({
    
    //we noticed the third arguments here "cb", this act as a callback function which excutes the function, so let's say we
    //want our destination in the client folder, so after defining where the location is, we attach the cb here to directly call it
    destination: function (req, file, cb) {
        //this is where our uploaded file destination
      cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
        //here we use "Date.now() + file.originalname" because everytime we upload a file we create a nickname calls original name
        //so to prevent from duplication of the name we use date.now() to know that this is a different file
      cb(null, Date.now() + file.originalname);
    },
  });
  //we can then now use the variable upload which holds the storage functionality 
  const upload = multer({ storage: storage });
  
  // --- our endpoint ---
  //we post our file to our storage destination and then use our upload functionlity and we only want a 'single' file, so we make a (req, res)
  //here
  app.post('/api/upload', upload.single('file', (req, res) => {

    //the file we are fetching comes from our user
    const file = req.file;
    //if ok our file will be uploaded to our db
    res.status(200).json(file.filename)
  }))

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