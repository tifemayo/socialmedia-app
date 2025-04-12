import { useState, useEffect } from "react";
import { makeRequest } from "../../axios";
import "./editPlatforms.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Instagram from "../../assets/instagram.png";
import TikTok from "../../assets/tik-tok.png";
import Unifeed from "../../assets/puzzle.png";

const EditPlatforms = ({ setOpenEditPlatforms }) => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  // Fetch current user platforms
  useEffect(() => {
    const fetchUserPlatforms = async () => {
      try {
        const response = await makeRequest.get(`/platforms?userId=${currentUser.id}`);
        setSelectedPlatforms(response.data);
      } catch (error) {
        console.error("Error fetching user platforms:", error);
      }
    };
    fetchUserPlatforms();
  }, [currentUser.id]);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'tiktok', name: 'TikTok', icon: TikTok },
    { id: 'unifeed', name: 'Unifeed', icon: Unifeed }
  ];

  const mutation = useMutation({
    mutationFn: (platforms) => {
      return makeRequest.put("/platforms", { userId: currentUser.id, platforms });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["platforms"]);
      setOpenEditPlatforms(false);
    },
  });

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(selectedPlatforms);
  };

  return (
    <div className="edit-platforms">
      <div className="wrapper">
        <h1>Edit Connected Platforms</h1>
        <form onSubmit={handleSubmit}>
          <div className="platforms-list">
            {platforms.map((platform) => (
              <div 
                key={platform.id} 
                className={`platform-item ${selectedPlatforms.includes(platform.id) ? 'selected' : ''}`}
                onClick={() => handlePlatformToggle(platform.id)}
              >
                <img src={platform.icon} alt={platform.name} />
                <span>{platform.name}</span>
              </div>
            ))}
          </div>
          <button type="submit">Save Changes</button>
        </form>
        <button className="close" onClick={() => setOpenEditPlatforms(false)}>X</button>
      </div>
    </div>
  );
};

export default EditPlatforms; 