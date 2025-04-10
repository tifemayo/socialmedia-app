import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import PlatformIcon from "../PlatformIcon/PlatformIcon";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import moment from "moment";


const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  //get/fetch the likes from the back end for the post
  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () => makeRequest.get(`/likes?postId=${post.id}`).then(res => res.data),
  });

  console.log(data)
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked){
        return makeRequest.delete("/likes?postId=" + post.id);
      }
      return makeRequest.post("/likes", { postId: post.id });
    },
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    
});
  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <div className="icon-container">
            {/* <img src={Instagram} alt="" /> */}
            <PlatformIcon platform={post.platform} />
            <MoreHorizIcon />
          </div>

        </div>
        <div className="content">
          <p>{post.desc}</p>
          {(post.media) && (
            <div className="mediaContainer">
              {post.mediaType === 'video' ? (
                <video controls autoPlay muted loop className="media">
                  <source src={"/upload/" + (post.media)} />
                  Your browser does not support video playback.
                </video>
              ) : (
                <img src={"/upload/" + (post.media)} alt="" className="media" />
              )}
            </div>
          )}
          {/* {post.img && <img src={`http://localhost:8800/upload/${post.img}`} alt="" />} */}
        </div>
        <div className="info">
          <div className="item">
            {/* Liked functionality */}
            {isLoading ? (
              "loading"
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {/* revisit to show number of comments  */}
            Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id}/>}
      </div>
    </div>
  );
};

export default Post;
