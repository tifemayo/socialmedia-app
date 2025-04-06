import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import {  useEffect, useState  } from "react";
import PlatformIcon from "../PlatformIcon/PlatformIcon";


const Posts = () => {

  //Functionality to filter posts by platforms 
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  
  //query to pull the data (posts) from backend 
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

  //filter functionality  continues
  const [filteredPosts, setFilteredPosts] = useState(data)
  const platforms = ["instagram", "tiktok", "unifeed"];

  const handlePlatformClick = (selectedCategory) => {
    if (selectedPlatforms.includes(selectedCategory)) {
      const platforms= selectedPlatforms.filter((el) => el !== selectedCategory);
      setSelectedPlatforms(platforms);
    } else {
      setSelectedPlatforms([...selectedPlatforms, selectedCategory]);
    }
  };
  useEffect(() => {
    filterPlatforms();
  }, [selectedPlatforms]);

  const filterPlatforms =() => {
    if (selectedPlatforms.length > 0) {
      let tempPosts = selectedPlatforms.map((selectedCategory) => {
        let temp = data?.filter(post => post.platform === selectedCategory);
        return temp;
      });
      setFilteredPosts(tempPosts.flat());
    } else {
      setFilteredPosts([...data]);
    }

  };

  return (
    <div className="postcontainer">
      <div className="platformFilter">
      {platforms.map((platform) => (
          <button
            onClick={() => handlePlatformClick(platform)}
            className={`button ${
              selectedPlatforms?.includes(platform) ? "active" : ""
            }`}
            key={platform}
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
          : filteredPosts?.map((posts) => <Post post={posts} key={posts.id} />)}
      </div>
    </div>
  
  );
};

export default Posts;