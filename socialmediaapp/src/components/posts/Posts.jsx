import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

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

  //filter functionality  continues
  const [filteredPosts, setFilteredPosts] = useState( Posts)
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
    
  }

  return (
    <div className="postcontainer">
      <div className="platformFilter">

      </div>

    
      <div className="posts">
        
        {error
          ? "Something went wrong!"
          : isLoading
          ? "loading"
          : data.map((posts) => <Post post={posts} key={posts.id} />)}
      </div>
    </div>
  
  );
};

export default Posts;