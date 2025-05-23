import { useState, useEffect } from "react";
import { makeRequest } from "../../axios";
import "./edit.scss";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Instagram from "../../assets/instagram.png";
import TikTok from "../../assets/tik-tok.png";
import Puzzle from "../../assets/puzzle.png";
import Timer from '../timer/Timer';
import Notification from '../timerNotification/Notification';
import defaultAvatar from "../../images/default.jpeg";
import { useTimer } from '../../context/timerContext';

// Dictionary of platforms and keys 
const platforms = [
  { id: "instagram", name: "Instagram", image: Instagram },
  { id: "tiktok", name: "TikTok", image: TikTok },
  { id: "unifeed", name: "Unifeed (Default)", image: Puzzle }
];

//Function to Edit a user profile 
const Edit = ({ setOpenEdit, user}) => {
  //Initialising variables to be used in later parts
  const queryClient = useQueryClient();
  const { currentUser, updateUser } = useContext(AuthContext);
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  //Variables handles the state of the edit form , if a value exists in backend , otherwise blank
  const [texts, setTexts] = useState({
    email: user?.email || "",
    password: user?.password || "",
    name: user?.name || "",
    username: user?.username || "",
    city: user?.city || "",
  });

  // Variables used to set time limit in edit pop up 
  const [dailyLimit, setDailyLimit] = useState(0);
  const [dailyGoal, setDailyGoal] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  // Fetch user's connected platforms
  const { data: userPlatforms, isLoading: userPlatformsLoading } = useQuery({
    queryKey: ["userPlatforms", user.id],
    queryFn: async () => {
      try {
        const response = await makeRequest.get(`/platforms?userId=${user.id}`);
        console.log("User platforms response:", response.data); // Debug  log for testing 
        return response.data;
      } catch (error) {
        console.error("Error fetching user platforms:", error);
        throw error;
      }
    },
  });

  useEffect(() => {
    if (userPlatforms) {
      console.log("Setting selected platforms:", userPlatforms); // Debug log
      setSelectedPlatforms(userPlatforms);
    }
  }, [userPlatforms]);

  // Load timer settings from localStorage
  useEffect(() => {
    const savedLimit = localStorage.getItem('dailyLimit');
    if (savedLimit) {
      setDailyLimit(Number(savedLimit));
    }
  }, []);

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const mutation = useMutation({
    mutationFn: (userData) => {
      return makeRequest.put("/users", userData);
    },
    onSuccess: (data) => {
      // Update the currentUser in AuthContext with the complete user data
      updateUser({
        ...currentUser,
        ...data,
        name: data.name,
        username: data.username,
        profilePic: data.profilePic,
        coverPic: data.coverPic
      });
      queryClient.invalidateQueries(["user"]);
    }
  });

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlatformToggle = async (platformId) => {
    try {
      setLoading(true);
      setError(null);

      if (selectedPlatforms.includes(platformId)) {
        // Disconnect the platform using DELETE endpoint
        const response = await makeRequest.delete(`/platforms`, {
          data: { 
            userId: user.id,
            platformId
          }
        });
        // Backend now returns the updated platforms list
        setSelectedPlatforms(response.data);
      } else {
        // Connect platform using PUT endpoint
        const updatedPlatforms = [...selectedPlatforms, platformId];
        const response = await makeRequest.put(`/platforms`, { 
          userId: user.id,
          platforms: updatedPlatforms
        });
        // Backend now returns the updated platforms list
        setSelectedPlatforms(response.data);
      }

      // Invalidate the platforms query to refresh the data
      queryClient.invalidateQueries(["userPlatforms"]);
    } catch (err) {
      console.error("Error toggling platform:", err);
      setError("Failed to update platform connection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { updateTimerSettings } = useTimer();
  
  // Function to update the profile
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);

    try {
      // Update the profile with values 
      let coverUrl;
      let profileUrl;
      
      coverUrl = cover ? await upload(cover) : user.coverPic;
      profileUrl = profile ? await upload(profile) : user.profilePic;
      
      await mutation.mutateAsync({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
      
      // Save timer settings to localStorage
      localStorage.setItem('dailyLimit', dailyLimit);
      localStorage.setItem('dailyGoal', dailyGoal);
      
      // Update timer settings globally
      updateTimerSettings(dailyLimit, dailyGoal);
      
      setOpenEdit(false);
      setCover(null);
      setProfile(null);
    } catch (err) {
      console.error("Error saving changes:", err);
      setError(err.response?.data?.message || "Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  }; 

  const handleLimitReached = () => {
    setShowNotification(true);
  };

  if (userPlatformsLoading) {
    return <div className="edit">Loading platforms...</div>;
  }

  return (
    <div className="edit">
      <div className="wrapper">
        <h1>Edit Profile</h1>
        <form>
          <div className="files">
            <label>
              Cover Picture
              <input 
                type="file" 
                onChange={(e) => setCover(e.target.files[0])}
                style={{ display: "none" }}
                id="cover"
              />
              <div className="imgContainer">
                <img
                  src={cover ? URL.createObjectURL(cover) : user.coverPic ? "/upload/" + user.coverPic : defaultAvatar}
                  alt=""
                />
              </div>
            </label>
            <label>
              Profile Picture
              <input 
                type="file" 
                onChange={(e) => setProfile(e.target.files[0])}
                style={{ display: "none" }}
                id="profile"
              />
              <div className="imgContainer">
                <img
                  src={profile ? URL.createObjectURL(profile) : user.profilePic ? "/upload/" + user.profilePic : defaultAvatar}
                  alt=""
                />
              </div>
            </label>
          </div>
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            onChange={handleChange}
            value={texts.name}
          />
          <label>Username</label>
          <input 
            type="text" 
            name="username" 
            onChange={handleChange}
            value={texts.username}
          />
  
      
          <label>Daily Time Limit (seconds)</label>
          <input 
            type="number" 
            value={dailyLimit} 
            onChange={(e) => setDailyLimit(Number(e.target.value))}
          />
          <label>Daily Goal</label>
          <input 
            type="text" 
            value={dailyGoal} 
            onChange={(e) => setDailyGoal(e.target.value)}
            placeholder="What do you want to achieve today?"
          />
          <Timer 
              timeLimit={dailyLimit} 
              dailyGoal={dailyGoal}
          />
          {showNotification && (
            <Notification
              message={`You have elapsed your time. Go work on your goal: "${dailyGoal}" and visit later!`} 
              onClose={() => setShowNotification(false)} 
            />
          )}
          <div className="platforms-section">
            <h3>Platforms</h3>
            {error && <div className="error-message">{error}</div>}
            <div className="platform-grid">
              {platforms.map((platform) => {
                const isConnected = selectedPlatforms.includes(platform.id);
                console.log(`Platform ${platform.id} is connected:`, isConnected); // Debug log
                return (
                  <button
                    key={platform.id}
                    className={`platform-button ${isConnected ? "selected" : ""}`}
                    onClick={() => handlePlatformToggle(platform.id)}
                    disabled={loading}
                  >
                    <img 
                      src={platform.image} 
                      alt={platform.name} 
                      className="platform-icon"
                    />
                    <span className="platform-name">{platform.name}</span>
                    <span className="platform-status">
                      {isConnected ? "Connected" : "Connect"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <button 
            className="save-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
        <button className="close" onClick={() => setOpenEdit(false)}>X</button>
      </div>
    </div>
  );
};

export default Edit;
