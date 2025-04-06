import Post from "../post/Post";
import "./posts.scss";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import PlatformIcon from "../PlatformIcon/PlatformIcon";
import { AuthContext } from "../../context/authContext";
import { useContext, useState, useEffect } from "react";


const Posts = () => {

  //Functionality to filter posts by platforms 
  const { currentUser } = useContext(AuthContext);
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [userPlatforms, setUserPlatforms] = useState([]);



  // query to Fetch / get a socialmedia user's integrated platforms , using current userID from local storage 
  useEffect(() => {
    const fetchUserPlatforms = async () => {
        try {
            const response = await axios.get(`http://localhost:8800/api/platforms?userId=${currentUser.id}`, {
                withCredentials: true
            });
            console.log("Fetched platforms:", response.data);
            setUserPlatforms(response.data);
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
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await makeRequest.get("/posts", {
        withCredentials: true  // This ensures cookies are sent with the request
      });
      return response.data;
    }
  });
  console.log("Data is:", data);

  
  // This main filter functionality helps to handle filtering post with one or more platforms based on selected plaftform buttons
  const handlePlatformClick = (platform) => {
    if (platform === "all") {
      setSelectedPlatforms([]);
    } else if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

 
  const filterPosts = selectedPlatforms.length === 0
  ? data 
  : data?.filter(post => selectedPlatforms.includes(post.platform ));


  // useEffect(() => {
  //   filterPlatforms();
  // }, [selectedPlatforms]);

  // const filterPlatforms =() => {
  //   if (selectedPlatforms.length > 0) {
  //     let tempPosts = selectedPlatforms.map((selectedCategory) => {
  //       let temp = data?.filter(post => post.platform === selectedCategory);
  //       return temp;
  //     });
  //     setFilteredPosts(tempPosts.flat());
  //   } else {
  //     setFilteredPosts([...data]);
  //   }

  // };

  return (
    <div className="postcontainer">
      <div className="platformFilter">
   
          <button
            onClick={() =>  handlePlatformClick("all")}
            className={`button ${selectedPlatforms.length === 0 ? "active" : ""}`}
          >
            <span>All Platforms</span>
          </button>
          {userPlatforms.map((platform) => (
          <button
            key={platform}
            onClick={() => handlePlatformClick(platform)}
            className={`button ${selectedPlatforms.includes(platform) ? "active" : ""}`}
          >
            <PlatformIcon platform={platform} />
            <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
          </button>
        ))}



      </div>

    
      <div className="posts">
        
        {error
          ? "Something went wrong!"
          : isLoading
          ? "loading"
          : filterPosts?.map((posts) => <Post post={posts} key={posts.id} />)}
      </div>
    </div>
  
  );
};

export default Posts;