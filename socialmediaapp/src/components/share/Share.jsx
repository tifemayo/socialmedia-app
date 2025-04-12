import "./share.scss";
import Image from "../../assets/img.png";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import PlatformIcon from "../PlatformIcon/PlatformIcon";
import axios from "axios";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [userPlatforms, setUserPlatforms] = useState([]);
  const [showPlatformSelect, setShowPlatformSelect] = useState(false);
  const {currentUser} = useContext(AuthContext);
  const [mediaType, setMediaType] = useState(null);

  // Fetch latest user data to ensure we have updated profile picture
  const { data: userData } = useQuery({
    queryKey: ["user", currentUser.id],
    queryFn: () => makeRequest.get(`/users/find/${currentUser.id}`).then(res => res.data)
  });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/default-profile.jpg";
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    return "/upload/" + imagePath;
  };

  const handlePlatformClick = () => {
    console.log("Platform button clicked"); // Debug log
    setShowPlatformSelect(!showPlatformSelect);
  };
  
  useEffect(() => {
    const fetchUserPlatforms = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/platforms?userId=${currentUser.id}`, {
          withCredentials: true
        });
        setUserPlatforms(response.data);
      } catch (error) {
        console.error("Error fetching platforms:", error);
      }
    };
    fetchUserPlatforms();
  }, [currentUser.id]);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  //Handles the preview of changing media files and setting the media type based on file extension
  const handleMediaChange = (e) => {
    const media = e.target.files[0];
    if (media) {
      if (file) {
        URL.revokeObjectURL(URL.createObjectURL(file));
      }
      const type = media.type.split('/')[0];
      setFile(media);
      setMediaType(type);
    }
  };

  const handleDeletePreview = () => {
    if (file) {
      URL.revokeObjectURL(URL.createObjectURL(file));
    }
    setFile(null);
    setMediaType(null);
  };

  // pushes the post to the backend and clears the form
  const handleClick = async (e) => {
    e.preventDefault();
    let mediaUrl = "";
    if (file) mediaUrl = await upload();
    for (const platform of selectedPlatforms) {
      const postData = {
        desc,
        media: mediaUrl,
        mediaType: mediaType,
        platform
      };
      mutation.mutate(postData);
    }
    setDesc("");
    setFile(null);
    setMediaType(null);
    setSelectedPlatforms([]);
    setShowPlatformSelect(false);
  };

  // Use userData if available, otherwise fall back to currentUser
  const displayUser = userData || currentUser;

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={getImageUrl(displayUser?.profilePic)}
              alt=""
            />
            <input 
              type="text" 
              placeholder={`What's on your mind ${displayUser?.name}?`} 
              onChange={(e) => setDesc(e.target.value)}  
              value={desc} 
            />
          </div>
          <div className="right">
          {file && (
            <>
              {mediaType === 'image' ? (
                <img className="file" alt="" src={URL.createObjectURL(file)} />
              ) : mediaType === 'video' ? (
                <video className="file" controls width="100%" preload="metadata">
                  <source src={URL.createObjectURL(file)} type={file.type} />
                  Your browser does not support the video tag.
                </video>
              ) : null}
              <span className="cancel" onClick={handleDeletePreview}> x </span>
            </>
          )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display:"none"}} onChange={handleMediaChange} accept="image/*,video/*"/>
            <label htmlFor="file">
              <div className="item">
                <AddCircleOutlineIcon/>
                <span>Add Media</span>
              </div>
            </label>
            <div className="platforms-inline">
              <span>Select Platform:</span>
              {userPlatforms.map((platform) => (
                <div 
                  key={platform}
                  className={`item ${selectedPlatforms.includes(platform) ? 'selected' : ''}`}
                  onClick={() => handlePlatformToggle(platform)}
                >
                  <PlatformIcon platform={platform} />
                  <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick} disabled={!desc || selectedPlatforms.length === 0}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
