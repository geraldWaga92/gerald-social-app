import { db } from '../connectMysql.js';
import Jwt from 'jsonwebtoken';
import moment from 'moment';

export const getPosts = (req, res) => {

    const userId = req.query.userId;

    //to get the users on the post we need the accessToken, remember the accessToken exist together with the logged in user, meaning the 
    //current user logged in, so to get the user we write the code line below. This assume that the user is logged in
    const token = req.cookies.accessToken;

    //if the user is not logged in
    if(!token) return res.status(401).json('Not logged in!')

    //now if ther user is logged in and there is a token, we first verify if it is valid, so we compare the token, and 'secretkey'. if there
    //is an error we throw token is not valid if is valid we return the data on this line "db.query(q, [data.id], (error, data)"
    Jwt.verify(token, 'secretkey', (error, userInfo) => { //I forgot to add our "userInfo" here,  that is why i recieved an error and there is no diplay on my feed section
        if (error) return res.status(403).json('Token is not valid!');

        //this line means that in our posts or what we see on our client side post is we have two components which is the users profile with it's name
        //and the posts itself, let's say we want to target the users profile so first we combine the two component and then make a condition that
        //the 'u.id' means the user id, and we place the 'u.id' inside the name userId together with name and profile. So this is a confusing line
        //but this is all what is does, it's just assigning values
        //the condition is updated and i won't be explaining it but you get the idea and it still thesame
        //this is line is included because we want our profile page to display only the profile posts
        const q = userId !== "undefined"
            ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
            : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
                LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
                ORDER BY p.createdAt DESC`;//the added ("WHERE r.followerUserId = ? OR p.userId = ?" and "LEFT JOIN" ) display not only the followed post but also your post
        //before the added line it only display the followed post

        //here if there is NOT a userId then return undefined but if it has then returned the userId and it's userInfo
        const values = userId !== 'undefined' ? [userId] : [userInfo.id, userInfo.id];
    
        //then we use the db which connect from our database and use query method to search for a data, and then use our q variable as argument for 
        //giving conditions, next is we get the data from the arguments above and remember that data we are refferring to is the data object from auth.js
        //remember the object "id: data[0].id". So if we say data.id this is thesame as 'data[0].id', remeber that we are targeting the current user
        //that is logged in and not the other user
        //--we add another 'data.id' because we want to display not only the followed post but also the follower, so the other data.id is our post
        //---REPLACE BY VALUES SEE THE ( db.query(q, [data.id, data.id], (error, data) => )-- 
        db.query(q, values, (error, data) => {
            if (error) return res.status(500).json(error);
            return res.status(200).json(data);
        })

    })
}


// --- add post ---
export const addPost = (req, res) => {
    //thesame as above, we look for accessToken
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json('Not logged in!')

    //verify again if it is valid and  
    Jwt.verify(token, 'secretkey', (error, data) => {
        if (error) return res.status(403).json('Token is not valid!');


        //here we are adding a post, to add post we must be logged in first
        //we create a variable q, which holds the posts format
        const q ="INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
        //must be aligned with the format above
        const values = [
            req.body.desc,
            req.body.img,
            //this is our library 'moment' for our createdAt
            moment(Date.now()).format("YYYY-MM-DD[T]HH:mm:ss"),
            //then our userId
            data.id,
        ];
       
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been created.");
        });
    })
}


// --- delete post ---
export const deletePost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    Jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q =
        "DELETE FROM posts WHERE `id`=? AND `userId` = ?";
  
      db.query(q, [req.params.id, userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
        return res.status(403).json("You can delete only your post")
      });
    });
  };