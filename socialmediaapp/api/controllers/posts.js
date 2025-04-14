import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import { preprocessText, calculateTfIdf, clusterDocuments, getRecommendations } from "../util/textProcessing.js";


export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // First get user's platforms
    const platformsQuery = "SELECT platform_name FROM user_platforms WHERE user_id = ?";
    db.query(platformsQuery, [userInfo.id], (platformErr, platformData) => {
      if (platformErr) return res.status(500).json(platformErr);
      
      const userPlatforms = platformData.map(row => row.platform_name);
      
      if (userPlatforms.length === 0) {
        return res.status(200).json([]); // Return empty array if user has no platforms
      }

      // Build the platform filter condition
      const platformCondition = userPlatforms.map(() => "p.platform = ?").join(" OR ");

      // Build the main query with platform filtering
      const q = userId 
        ? `SELECT p.*, u.id AS userId, name, profilePic 
           FROM posts AS p 
           JOIN users AS u ON (u.id = p.userId) 
           WHERE p.userId = ? AND (${platformCondition})
           ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS userId, name, profilePic 
           FROM posts AS p 
           JOIN users AS u ON (u.id = p.userId) 
           LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) 
           WHERE (r.followerUserId = ? OR p.userId = ?) 
           AND (${platformCondition})
           ORDER BY p.createdAt DESC`;

      // Combine all values for the query
      const values = userId 
        ? [userId, ...userPlatforms]
        : [userInfo.id, userInfo.id, ...userPlatforms];

      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`desc`, `media`, `mediaType`, `platform`, `createdAt`, `userId` ) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.media,
      req.body.mediaType, 
      req.body.platform,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];
    
    console.log("Inserting post with values:", values); // Debug log

    
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      console.error("Database error:", err)
      return res.status(200).json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};

// Enhanced search posts function with intelligence features
export const searchPosts = (req, res) => {
  const searchQuery = req.query.q;
  
  if (!searchQuery || searchQuery.trim() === '') {
    return res.status(200).json([]);
  }

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Get user's platforms
    const platformsQuery = "SELECT platform_name FROM user_platforms WHERE user_id = ?";
    db.query(platformsQuery, [userInfo.id], (platformErr, platformData) => {
      if (platformErr) return res.status(500).json(platformErr);
      
      const userPlatforms = platformData.map(row => row.platform_name);
      
      if (userPlatforms.length === 0) {
        return res.status(200).json([]);
      }

      // Build the platform filter condition
      const platformCondition = userPlatforms.map(() => "p.platform = ?").join(" OR ");

      // Search in post description and user name
      const searchTerm = `%${searchQuery}%`;
      
      const q = `
        SELECT p.*, u.id AS userId, u.name, u.profilePic 
        FROM posts AS p 
        JOIN users AS u ON (u.id = p.userId) 
        WHERE (p.desc LIKE ? OR u.name LIKE ?) 
        AND (${platformCondition})
        ORDER BY p.createdAt DESC
        LIMIT 50
      `;

      const values = [searchTerm, searchTerm, ...userPlatforms];

      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        
        // If no results, return empty array
        if (data.length === 0) {
          return res.status(200).json([]);
        }
        
        try {
          // Apply TF-IDF for relevance scoring
          const tfidf = calculateTfIdf(data);
          const searchTerms = preprocessText(searchQuery);
          
          // Score each post based on TF-IDF relevance to search query
          const scoredPosts = data.map((post, index) => {
            let relevanceScore = 0;
            
            searchTerms.forEach(term => {
              relevanceScore += tfidf.tfidf(term, index);
            });
            
            return {
              ...post,
              relevanceScore: relevanceScore || 0.1 // Ensure minimum score
            };
          });
          
          // Sort by relevance score
          scoredPosts.sort((a, b) => b.relevanceScore - a.relevanceScore);
          
          // Apply clustering to identify topics
          clusterDocuments(scoredPosts).then(clusteredPosts => {
            // Get recommendations for the top post
            let recommendations = [];
            if (clusteredPosts.length > 0) {
              recommendations = getRecommendations(clusteredPosts[0], data);
            }
            
            // Return search results with metadata
            return res.status(200).json({
              results: clusteredPosts,
              recommendations,
              searchMetadata: {
                query: searchQuery,
                totalResults: clusteredPosts.length,
                processingTime: new Date().getTime()
              }
            });
          }).catch(clusterErr => {
            console.error("Clustering error:", clusterErr);
            // Fallback to just returning scored posts if clustering fails
            return res.status(200).json({
              results: scoredPosts,
              recommendations: [],
              searchMetadata: {
                query: searchQuery,
                totalResults: scoredPosts.length,
                processingTime: new Date().getTime()
              }
            });
          });
        } catch (processingErr) {
          console.error("Text processing error:", processingErr);
          // Fallback to returning original results if text processing fails
          return res.status(200).json(data);
        }
      });
    });
  });
};
