import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Link, useNavigate } from "react-router-dom";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  //get/fetch the likes from the back end for the post
  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () => makeRequest.get(`/likes?postId=${post.id}`).then(res => res.data),
  });

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

  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
    window.scrollTo(0, 0);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(post.id);
    }
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/" + post.profilePic} alt="" />
            <div className="details">
              <span 
                className="name" 
                onClick={() => handleProfileClick(post.userId)}
                style={{ cursor: "pointer" }}
              >
                {post.name}
              </span>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <div className="icon-container">
            <PlatformIcon platform={post.platform} />
            {post.userId === currentUser.id && (
              <div className="menu-container">
                <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)}/>
                {menuOpen && (
                  <div className="menu-dropdown">
                    <button className="delete-button" onClick={handleDelete}>
                      <DeleteOutlineIcon className="delete-icon" />
                      <span>Delete Post</span>
                    </button>
                  </div>
                )}
              </div>
            )}
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
        </div>
        <div className="info">
          <div className="item">
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
            {data?.length} likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
