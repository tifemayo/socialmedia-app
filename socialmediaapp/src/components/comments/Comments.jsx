import { useContext, useState  } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => makeRequest.get(`/comments?postId=${postId}`).then(res => res.data)
  });

  const mutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/comments", newComment),
    onSuccess: () => queryClient.invalidateQueries(["comments"])
  });

  const handleClick = (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/default-profile.jpg";
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    return "/upload/" + imagePath;
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={getImageUrl(currentUser?.profilePic)} alt="" />
        <input 
          type="text" 
          placeholder="write a comment" 
          value={desc} 
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error ? "Something went wrong" : isLoading ? "loading" : data.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={getImageUrl(comment.profilePic)} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
