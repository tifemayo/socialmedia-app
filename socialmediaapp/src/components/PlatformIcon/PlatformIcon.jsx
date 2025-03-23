import Instagram from "../../assets/instagram.png";
import TikTok from "../../assets/tik-tok.png";
import Unifeed from "../../assets/puzzle.png"; // Add this import


const PlatformIcon = ({ platform }) => {
  const platformIcons = {
    instagram: Instagram,
    // twitter: TwitterIcon,
    // facebook: FacebookIcon,
    // linkedin: LinkedInIcon,
    tiktok: TikTok,
    unifeed: Unifeed
  };

//   const icon = platformIcons[platform.toLowerCase()] || null;
    const icon = platform ? platformIcons[platform.toLowerCase()] : null;


  return icon ? (
    <img 
      src={icon} 
      alt={`${platform} icon`}
      style={{ width: "24px", height: "24px" }}
    />
  ) : null;
};

export default PlatformIcon;