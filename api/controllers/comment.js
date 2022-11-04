import { db } from "../connectMysql.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
    //here it's thesame on our post but we just copy and change posts to comments, notice we don't include realationship here
    //because what we only fetch is the postId comments and date cratedAt
    const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? ORDER BY c.createdAt DESC
    `;

    //we need "[req.query.postId]" because 'postId' is our endpoint, remember in the client Comments.jsx, our
    //endpoint is this ("/comments?postId=" + postId)
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};