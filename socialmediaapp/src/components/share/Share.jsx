import "./share.scss";
import Image from "../../assets/img.png";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
        // Invalidate and refetch
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
  const handleMediaChange= (e) => {
    const media = e.target.files[0];
    if (media) {
      if (file) {
        URL.revokeObjectURL(URL.createObjectURL(file));
      }
      const type = media.type.split('/')[0]; // checks media type starts with 'image' or 'video' OR media.type.startsWith('image') ? 'image' : 'video'
      setFile(media);
      setMediaType(type);
    }
    
  };

  // pushes the post to the backend and clears the form
  const handleClick = async (e) => {
    e.preventDefault();
    let mediaUrl = "";
    if (file) mediaUrl = await upload();
    // Create a post for each selected platform
    for (const platform of selectedPlatforms) {
      const postData = {
        desc,
        media: mediaUrl,
        mediaType: mediaType,
        platform
      };
      console.log("Creating post for platform:", postData); // Debug log
      mutation.mutate(postData);
    }
    

    setDesc("");
    setFile(null);
    setMediaType(null);
    setSelectedPlatforms([]);
    setShowPlatformSelect(false);
  };
 

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={currentUser.profilePic}
              alt=""
            />
            <input type="text" placeholder={`What's on your mind ${currentUser.name}?`} onChange={(e) => setDesc(e.target.value)}  value={desc} />
          </div>
          <div className="right">
          {file && (
            mediaType === 'image' ? (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            ) : mediaType === 'video' ? (
              <video className="file" controls width="100%" preload="metadata">
                <source src={URL.createObjectURL(file)} type={file.type} />
                Your browser does not support the video tag.
              </video>
            ) : null)}
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
            <button onClick={handleClick} disabled={!desc || selectedPlatforms.length === 0} >Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
