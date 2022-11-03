import { db } from '../connectMysql.js';

export const getPosts = (req, res) => {

    //this line means that in our posts or what we see on our client side post is we have two components which is the users profile with it's name
    //and the posts itself, let's say we want to target the users profile so first we combine the two component and then make a condition that
    //the 'u.id' means the user id, and we place the 'u.id' inside the name userId together with name and profile. So this is a confusing line
    //but this is all what is does, it's just assigning values
    const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users
    AS u ON (u.id = p.userId)`


    db.query(q, (error, data) => {
        if (error) return res.status(500).json(error);
    })

}