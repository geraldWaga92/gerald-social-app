import { db } from '../connectMysql.js';
import Jwt from 'jsonwebtoken';

export const getPosts = (req, res) => {

    //to get the users on the post we need the accessToken, remember the accessToken exist together with the logged in user, meaning the 
    //current user logged in, so to get the user we write the code line below. This assume that the user is logged in
    const token = req.cookies.accessToken;

    //if the user is not logged in
    if(!token) return res.status(401).json('Not logged in!')

    //now if ther user is logged in and there is a token, we first verify if it is valid, so we compare the token, and 'secretkey'. if there
    //is an error we throw token is not valid if is valid we return the data on this line "db.query(q, [data.id], (error, data)"
    Jwt.verify(token, 'secretkey', (error, data) => {
        if (error) return res.status(403).json('Token is not valid!');

        //this line means that in our posts or what we see on our client side post is we have two components which is the users profile with it's name
        //and the posts itself, let's say we want to target the users profile so first we combine the two component and then make a condition that
        //the 'u.id' means the user id, and we place the 'u.id' inside the name userId together with name and profile. So this is a confusing line
        //but this is all what is does, it's just assigning values
        //the condition is updated and i won't be explaining it but you get the idea and it still thesame
        const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users
        AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId)
        WHERE r.followerUserId = ? OR p.userId = ?`;//the added ("WHERE r.followerUserId = ? OR p.userId = ?" and "LEFT JOIN" ) display not only the followed post but also your post
        //before the added line it only display the followed post
    
        //then we use the db which connect from our database and use query method to search for a data, and then use our q variable as argument for 
        //giving conditions, next is we get the data from the arguments above and remember that data we are refferring to is the data object from auth.js
        //remember the object "id: data[0].id". So if we say data.id this is thesame as 'data[0].id', remeber that we are targeting the current user
        //that is logged in and not the other user
        //--we add another 'data.id' because we want to display not only the followed post but also our, so the other data.id is our post
        db.query(q, [data.id, data.id], (error, data) => {
            if (error) return res.status(500).json(error);
            return res.status(200).json(data);
        })

    })


}


export const addPost = (req, res) => {

   
    const token = req.cookies.accessToken;


    if(!token) return res.status(401).json('Not logged in!')

    
    Jwt.verify(token, 'secretkey', (error, data) => {
        if (error) return res.status(403).json('Token is not valid!');

        const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users
        AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId)
        WHERE r.followerUserId = ? OR p.userId = ?`;
       
        db.query(q, [data.id, data.id], (error, data) => {
            if (error) return res.status(500).json(error);
            return res.status(200).json(data);
        })
    })
}