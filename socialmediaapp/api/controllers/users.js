import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id=?";

    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        const { password, ...info } = data[0];
        return res.json(info);
      });

}

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) {
          // Fetch and return the updated user data
          const selectQ = "SELECT * FROM users WHERE id=?";
          db.query(selectQ, [userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            const { password, ...info } = data[0];
            return res.json(info);
          });
        } else {
          return res.status(403).json("You can update only your post!");
        }
      }
    );
  });
}
export const getSuggestions = (req, res) => {
    const userId = req.query.userId;
    const limit = parseInt(req.query.limit) || 4;

    const q = `
        SELECT DISTINCT u.* 
        FROM users u 
        WHERE u.id != ? 
        AND u.id NOT IN (
            SELECT followedUserId 
            FROM relationships 
            WHERE followerUserId = ?
        )
        ORDER BY u.id
        LIMIT ?`;

    db.query(q, [userId, userId, limit], (err, data) => {
        if (err) return res.status(500).json(err);
        const users = data.map(user => {
            const { password, ...info } = user;
            return info;
        });
        return res.json(users);
    });
};
