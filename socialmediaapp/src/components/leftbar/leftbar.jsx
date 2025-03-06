import "./leftbar.scss"
// import following from "../../assets/followers.png";
import PeopleIcon from '@mui/icons-material/People';
// import Community from "../../assets/community.png";
import GroupsIcon from '@mui/icons-material/Groups';
// import Analytics from "../../assets/data-analytics.png";
import BarChartIcon from '@mui/icons-material/BarChart';
// import Create from "../../assets/add.png";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import Messages from "../../assets/message.png";
import ChatBubbleSharpIcon from '@mui/icons-material/ChatBubbleSharp';
// import Notifications from "../../assets/notification.png";
// import Explore from "../../assets/search.png";
// import Videos from "../../assets/youtube.png";
import OndemandVideoSharpIcon from '@mui/icons-material/OndemandVideoSharp';
import Instagram from "../../assets/instagram.png";
import TikTok from "../../assets/tik-tok.png";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const LeftBar = () => {
    const { currentUser } = useContext(AuthContext);

    return (
      <div className="leftBar">
        <div className="container">
          <div className="menu">
            <Link to="/profile/1" style={{textDecoration:"none"}}>
                <div className="user">
                <img
                    src={currentUser.profilePic}
                    alt=""
                />
                <span>{currentUser.name}</span>
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
            <div className="item">
              <img src={Instagram} alt="" />
              <span>Instagram</span>
            </div>
            <div className="item">
              <img src={TikTok} alt="" />
              <span>TikTok </span>
            </div>
            
          </div>
          <hr />
          
        </div>
      </div>
    );
  };

export default LeftBar;