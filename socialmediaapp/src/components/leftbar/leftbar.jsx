import "./leftbar.scss"
import axios from "axios";
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChatBubbleSharpIcon from '@mui/icons-material/ChatBubbleSharp';
import OndemandVideoSharpIcon from '@mui/icons-material/OndemandVideoSharp';
import Instagram from "../../assets/instagram.png";
import TikTok from "../../assets/tik-tok.png";
import Unifeed from "../../assets/puzzle.png";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { AuthContext } from "../../context/authContext";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LeftBar = () => {
    const { currentUser } = useContext(AuthContext);
    const [userPlatforms, setUserPlatforms] = useState([]);

    useEffect(() => {
      const fetchUserPlatforms = async () => {
          try {
              const response = await axios.get(`http://localhost:8800/api/platforms?userId=${currentUser.id}`, {
                  withCredentials: true
              });
              console.log("Fetched platforms:", response.data);
              setUserPlatforms(response.data);
          } catch (error) {
              console.error("Error fetching user platforms:", error);
          }
      };
      if (currentUser?.id) { // Only fetch if we have a user ID
        fetchUserPlatforms();
      }
    }, [currentUser.id]);

    const getPlatformImage = (platformId) => {
        switch (platformId) {
            case 'instagram':
                return Instagram;
            case 'tiktok':
                return TikTok;
            case 'unifeed':
                return Unifeed;
            default:
              console.warn(`Unknown platform: ${platformId}`); // Debug log
              return null;
        }
    };

    return (
      <div className="leftBar">
        <div className="container">
          <div className="menu">
            <Link to={`/profile/${currentUser.id}`} style={{textDecoration:"none"}}>
                <div className="user">
                <img
                    src={currentUser.profilePic}
                    alt=""
                />
                <span>{currentUser.username}</span>
                </div>
            </Link>
            <div className="item">
                <PeopleIcon/>
            {/* <img src={following} alt="" /> */}
              <span>Following</span>
            </div>
            <div className="item">
                <GroupsIcon />
              {/* <img src={Community} alt="" /> */}
              <span>Community</span>
            </div>
            <div className="item">
                <BarChartIcon />
              {/* <img src={Analytics} alt="" /> */}
              <span>Analytics</span>
            </div>
            <div className="item">
              {/* <img src={Create} alt="" /> */}
              <AddCircleOutlineIcon/>
              <span>Create</span>
            </div>
            <div className="item">
            <NotificationsOutlinedIcon/>
              <span>Notifications</span>
            </div>
            <div className="item">
              <OndemandVideoSharpIcon />
              {/* <img src={Videos} alt="" /> */}
              <span>Videos</span>
            </div>
            <div className="item">
                <ChatBubbleSharpIcon />
              {/* <img src={Messages} alt="" /> */}
              <span>Messages</span>
            </div>
          </div>
          <hr />
          <div className="menu">
            <span>Your Platforms </span>
            {/* <div className="item">
              <img src={Instagram} alt="" />
              <span>Instagram</span>
            </div>
            <div className="item">
              <img src={TikTok} alt="" />
              <span>TikTok </span>
            </div> */}
            {userPlatforms.map((platform) => (
                <div className="item" key={platform}>
                    <img src={getPlatformImage(platform)} alt={platform} />
                    <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                </div>
            ))}
          </div>
          <hr />
          
        </div>
      </div>
    );
  };

export default LeftBar;