import { db } from "../connectMysql.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    //here we don't want our password to be displayed in the object
    const { password, ...info } = data[0];
    return res.json(info);
  });
}; 

export const updateUser = (req, res) => {

  //here we need our token because only the user can update
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
 
    const q =
    //here we can update the users in our DB through the name, city, website, profilePic and coverPic where the id must also match with the current user 
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    db.query( q,
      //here we query our users properties and if it is successfull return the data
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.coverPic,
        req.body.profilePic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        //if it is not updated then it is not our id
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};