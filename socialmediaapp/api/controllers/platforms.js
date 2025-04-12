import { db } from "../connect.js";

export const saveUserPlatforms = (req, res) => {
  const { platforms, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // First, delete any existing platforms for this user
  const deleteQuery = "DELETE FROM user_platforms WHERE user_id = ?";
  
  db.query(deleteQuery, [userId], (deleteErr) => {
    if (deleteErr) return res.status(500).json({ error: deleteErr.message });
    
    // Only insert new platforms if there are any to insert
    if (platforms && platforms.length > 0) {
      // Then insert the new platforms
      const insertQuery = "INSERT INTO user_platforms (user_id, platform_name) VALUES ?";
      const values = platforms.map(platform => [userId, platform]);

      db.query(insertQuery, [values], (insertErr) => {
        if (insertErr) return res.status(500).json({ error: insertErr.message });
        
        // Update user status to indicate platforms are selected
        const updateUserQuery = "UPDATE users SET has_selected_platforms = 1 WHERE id = ?";
        db.query(updateUserQuery, [userId], (updateErr) => {
          if (updateErr) return res.status(500).json({ error: updateErr.message });
          
          // Return the updated list of platforms
          const getUpdatedPlatforms = "SELECT platform_name FROM user_platforms WHERE user_id = ?";
          db.query(getUpdatedPlatforms, [userId], (getPlatformsErr, platformsData) => {
            if (getPlatformsErr) return res.status(500).json({ error: getPlatformsErr.message });
            const updatedPlatforms = platformsData.map(row => row.platform_name);
            res.status(200).json(updatedPlatforms);
          });
        });
      });
    } else {
      // If no platforms to insert, just return empty array
      res.status(200).json([]);
    }
  });
};

export const getUserPlatforms = (req, res) => {
  const userId = req.query.userId;
  
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  
  const query = "SELECT platform_name FROM user_platforms WHERE user_id = ?";
  
  db.query(query, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    const platforms = data.map(row => row.platform_name);
    res.status(200).json(platforms);
  });
};

export const deletePlatform = (req, res) => {
  const { userId, platformId } = req.body;

  if (!userId || !platformId) {
    return res.status(400).json({ message: "User ID and Platform ID are required" });
  }

  const deleteQuery = "DELETE FROM user_platforms WHERE user_id = ? AND platform_name = ?";
  
  db.query(deleteQuery, [userId, platformId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Return the updated list of platforms
    const getUpdatedPlatforms = "SELECT platform_name FROM user_platforms WHERE user_id = ?";
    db.query(getUpdatedPlatforms, [userId], (getPlatformsErr, platformsData) => {
      if (getPlatformsErr) return res.status(500).json({ error: getPlatformsErr.message });
      const updatedPlatforms = platformsData.map(row => row.platform_name);
      res.status(200).json(updatedPlatforms);
    });
  });
};