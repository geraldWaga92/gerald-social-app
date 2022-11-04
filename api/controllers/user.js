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