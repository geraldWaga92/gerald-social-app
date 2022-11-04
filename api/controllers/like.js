import { db } from "../connectMysql.js";
import jwt from "jsonwebtoken";

export const getLikes = (req,res)=>{
    //we don't need our jwt here because we only want userId and postId
    const q = "SELECT userId FROM likes WHERE postId = ?";

    db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      //we map the data which contain the like array that we specifies in our Db, remember we declare that userId2 to liked the userId12
      //that's why the heart img of userId12 is red, our functinality workes
      return res.status(200).json(data.map(like => like.userId));
    });
}

// ---- addLike -----
export const addLike = (req, res) => {
  //we need our JWT token here because only the user can like a post
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  //verify again
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    //insert the likes into our DB
    const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.postId
    ];

    //then pass the like value into our DB
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been liked.");
    });
  });
};

export const deleteLike = (req, res) => {

  //again only the user  can delete
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    //here the condition to delete a like is if the userId matched the userId the user selected to delete
    //and the also matched the postId the user wants to delete
    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";
   

    //we don't need the values here we just directly insert our userInfo id here meaning the user that like the post, and the postId that located in the body
    //which is the post that we want to delete
    db.query(q, [userInfo.id, req.params.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been disliked.");
    });
  });
};