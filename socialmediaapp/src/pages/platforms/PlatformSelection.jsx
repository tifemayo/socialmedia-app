import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PlatformSelection.scss";

const platforms = [
  { id: "instagram", name: "Instagram" },
  { id: "tiktok", name: "TikTok" },
  { id: "twitter", name: "Twitter" }
];

const PlatformSelection = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleToggle = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSubmit = async () => {
    if (selectedPlatforms.length === 0) {
      setError("Please select at least one platform");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      
      const userId = localStorage.getItem("userId");

      const response = await axios.post(
        "http://localhost:8800/api/platforms", 
        { platforms: selectedPlatforms,
          userId: userId // Include userId in the request
        }, 
        { withCredentials: true }
      );

      console.log("Platforms saved:", response.data);

       
      // Clear userId from localStorage after successful save
      localStorage.removeItem("userId");
      
      navigate("/login");
 
    } catch (error) {
      console.error("Error saving platforms:", error);
      setError(error.response?.data?.message || "Failed to save platforms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="platform-selection">
      <h2>Select Platforms to Follow</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="platform-grid">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            className={`platform-button ${
              selectedPlatforms.includes(platform.id) ? "selected" : ""
            }`}
            onClick={() => handleToggle(platform.id)}
            disabled={loading}
          >
            {platform.name}
          </button>
        ))}
      </div>

      <button 
        className="continue-button"
        onClick={handleSubmit} 
        disabled={selectedPlatforms.length === 0 || loading}
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  );
};

export default PlatformSelection;