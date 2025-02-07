import "./leftbar.scss"
import following from "../../assets/followers.png";
import Community from "../../assets/community.png";
import Analytics from "../../assets/data-analytics.png";
import Create from "../../assets/add.png";
import Messages from "../../assets/message.png";
import Notifications from "../../assets/notification.png";
// import Explore from "../../assets/search.png";
import Videos from "../../assets/youtube.png";
import Instagram from "../../assets/instagram.png";
import TikTok from "../../assets/tik-tok.png";


// import { AuthContext } from "../../context/authContext";
// import { useContext } from "react";

const LeftBar = () => {
    // const { currentUser } = useContext(AuthContext);

    return (
      <div className="leftBar">
        <div className="container">
          <div className="menu">
            {/* <div className="user">
              <img
                src={currentUser.profilePic}
                alt=""
              />
              <span>{currentUser.name}</span>
            </div> */}
            <div className="item">
            <img src={following} alt="" />
              <span>Following</span>
            </div>
            <div className="item">
              <img src={Community} alt="" />
              <span>Community</span>
            </div>
            <div className="item">
              <img src={Analytics} alt="" />
              <span>Analytics</span>
            </div>
            <div className="item">
              <img src={Create} alt="" />
              <span>Create</span>
            </div>
            <div className="item">
              <img src={Notifications} alt="" />
              <span>Notifications</span>
            </div>
            <div className="item">
              <img src={Videos} alt="" />
              <span>Videos</span>
            </div>
            <div className="item">
              <img src={Messages} alt="" />
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