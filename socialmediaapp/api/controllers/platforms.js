import { db } from "../connect.js";

export const saveUserPlatforms = (req, res) => {
  const { platforms, userId } = req.body;

  if (!platforms || platforms.length === 0) {
    return res.status(400).json({ message: "No platforms selected" });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // First, delete any existing platforms for this user
  const deleteQuery = "DELETE FROM user_platforms WHERE user_id = ?";
  
  db.query(deleteQuery, [userId], (deleteErr) => {
    if (deleteErr) return res.status(500).json({ error: deleteErr.message });
    
    // Then insert the new platforms
    const insertQuery = "INSERT INTO user_platforms (user_id, platform_name) VALUES ?";
    const values = platforms.map(platform => [userId, platform]);

    db.query(insertQuery, [values], (insertErr) => {
      if (insertErr) return res.status(500).json({ error: insertErr.message });
      
      // Update user status to indicate platforms are selected
      const updateUserQuery = "UPDATE users SET has_selected_platforms = 1 WHERE id = ?";
      db.query(updateUserQuery, [userId], (updateErr) => {
        if (updateErr) return res.status(500).json({ error: updateErr.message });
        res.status(200).json({ message: "Platforms saved successfully" });
      });
    });
  });
};

export const getUserPlatforms = (req, res) => {
  const userId = req.body.userId || req.query.userId;
  
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  
  const query = "SELECT UP.* FROM user_platforms AS UP WHERE user_id = ?";
  
  db.query(query, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    const platforms = data.map(row => row.platform_name);
    res.status(200).json(platforms);
  });
};