import Post from "../post/Post";
import "./posts.scss";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import PlatformIcon from "../PlatformIcon/PlatformIcon";
import { AuthContext } from "../../context/authContext";
import { useContext, useState, useEffect } from "react";

const Posts = ({userId}) => {

  //Functionality to filter posts by platforms 
  const { currentUser } = useContext(AuthContext);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [userPlatforms, setUserPlatforms] = useState([]);


  // query to Fetch/get a socialmedia user's integrated platforms , using current userID from local storage 
  useEffect(() => {
    const fetchUserPlatforms = async () => {
      try {
        const response = await makeRequest.get(`/platforms?userId=${currentUser.id}`);
        console.log("Fetched platforms:", response.data);
        setUserPlatforms(response.data);
        // Initially set selected platforms to all user platforms
        setSelectedPlatforms(response.data);
      } catch (error) {
        console.error("Error fetching user platforms:", error);
      }
    };
    if (currentUser?.id) { // Only fetch if we have a user ID
      fetchUserPlatforms();
    }
  }, [currentUser.id]);
  
  //query to fetch the data (posts) from backend 
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", userId],
    queryFn: async () => {
      // If userId is provided, fetch only that user's posts (for profile page)
      // If not, fetch all posts for the home page (user's posts + followed users' posts)
      const url = userId ? `/posts?userId=${userId}` : "/posts";
      const response = await makeRequest.get(url, {
        withCredentials: true  // This ensures cookies are sent with the request
      });
      return response.data;
    }
  });
  // console.log("Data is:", data);

  
  // This main filter functionality helps to handle filtering post with one or more platforms based on selected plaftform buttons
  const handlePlatformClick = (platform) => {
    if (platform === "all") {
      setSelectedPlatforms(userPlatforms); // Show all user's platforms
    } else {
      if (selectedPlatforms.includes(platform)) {
        // Don't allow deselecting if it's the last selected platform
        if (selectedPlatforms.length > 1) {
          setSelectedPlatforms(prev => prev.filter(p => p !== platform));
        }
      } else {
        setSelectedPlatforms(prev => [...prev, platform]);
      }
    }
  };

  // Filter posts based on selected platforms
  const filteredPosts = data?.filter(post => selectedPlatforms.includes(post.platform)) || [];

  if (!userPlatforms.length) {
    return (
      <div className="postcontainer">
        <div className="no-platforms-message">
          Please connect to at least one platform to see posts.
        </div>
      </div>
    );
  }

  return (
    <div className="postcontainer">
      <div className="platformFilter">
        <button
          onClick={() => handlePlatformClick("all")}
          className={`button ${selectedPlatforms.length === userPlatforms.length ? "active" : ""}`}
        >
          <span>All Platforms</span>
        </button>
        {userPlatforms.map((platform) => (
          <button
            key={platform}
            onClick={() => handlePlatformClick(platform)}
            className={`button ${selectedPlatforms.includes(platform) ? "active" : ""}`}
            disabled={selectedPlatforms.length === 1 && selectedPlatforms.includes(platform)}
          >
            <PlatformIcon platform={platform} />
            <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
          </button>
        ))}



      </div>

      <div className="posts">
      {error ? (
          "Something went wrong!"
        ) : isLoading ? (
          "Loading..."
        ) : filteredPosts.length === 0 ? (
          <div className="no-posts-message">
            No posts available for the selected platforms.
          </div>
        ) : (
          filteredPosts.map((post) => <Post post={post} key={post.id} />)
        )}
      </div>
    </div>
  );
};

export default Posts;