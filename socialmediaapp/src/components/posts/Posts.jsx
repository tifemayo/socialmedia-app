import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await makeRequest.get("/posts", {
        withCredentials: true  // This ensures cookies are sent with the request
      });
      return response.data;
    }
  });

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((posts) => <Post post={posts} key={posts.id} />)}
    </div>
  );
};

export default Posts;