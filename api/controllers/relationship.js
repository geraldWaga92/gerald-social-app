import { db } from "../connectMysql.js";
import jwt from "jsonwebtoken";

//--getRelationship--
export const getRelationships = (req,res)=>{
    //again we match the followerUserId if it matched to the current user followeduser id
    const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

    db.query(q, [req.query.followedUserId], (err, data) => {
      if (err) return res.status(500).json(err);
      //just like on like, we map the data to form an object
      return res.status(200).json(data.map(relationship=>relationship.followerUserId));
    });
}

//--addRelationship--
export const addRelationship = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
      const values = [
        userInfo.id,//because we are the follower
        req.body.userId//this is the followed userId
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Following");
      });
    });
  };
  

  //--deleteRelationship--
  export const deleteRelationship = (req, res) => {
  
    //we need token here because only the user can delete relationship
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";
  
      //here we pass the current user which is the userInfo.id and the userId which we followed
      db.query(q, [userInfo.id, req.query.userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Unfollow");
      });
    });
  };