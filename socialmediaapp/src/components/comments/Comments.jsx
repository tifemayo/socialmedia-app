import { useContext, useState  } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import defaultAvatar from "../../images/default.jpeg";

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

  return (
    <div className="comments">
      <div className="write">
        <img 
          src={currentUser.profilePic ? "/upload/" + currentUser.profilePic : defaultAvatar} 
          alt="" 
        />
        <input
          type="text"
          placeholder="Write a comment..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading 
        ? "loading" 
        : data.map((comment) => (
          <div className="comment" key={comment.id}>
            <img 
              src={comment.profilePic ? "/upload/" + comment.profilePic : defaultAvatar} 
              alt="" 
            />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
        ))}
    </div>
  );
};

export default Comments;
