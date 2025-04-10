import "./Profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import post1 from '../../images/girl-afro.jpg';
import post2 from '../../images/comic-book-lifestyle-scene-with-friends_23-2151133652.avif';
import post3 from '../../images/side-view-anime-style-man-portrait.jpg';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import PlatformIcon from "../../components/PlatformIcon/PlatformIcon";

const Profile = () => {

 // extracts the userId from the URL pathname using the useLocation hook
  const userId = parseInt(useLocation().pathname.split("/")[2]);


 // uses useQuery hook to fetch user data from the server
  const { isLoading: userLoading, error, data: userData } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => makeRequest.get(`/users/find/ + userId`).then(res => res.data),
  });

  //fetch user platforms
   const { isLoading: platformsLoading, data: platforms } = useQuery({
    queryKey: ["platforms", userId],
    queryFn: () => makeRequest.get(`/platforms?userId=${userId}`).then(res => res.data),
  });

  if (userLoading || platformsLoading) return "Loading...";
 

  return (
    <div className="profile">
      <div className="images">
        <img
          src= {userData.coverPic}
          alt=""
          className="cover"
        />
        <img
          src={userData.profilePic}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{userData.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>lagos</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>tife.mayo.com</span>
              </div>
              <div className="platforms">
                <h3>Connected Platforms</h3>
                <div className="platform-list">
                  {platforms?.map((platform) => (
                    <div key={platform} className="platform-item">
                      <PlatformIcon platform={platform} />
                      <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button>follow</button>
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
      <Posts/>
      </div>
    </div>
  );
};

export default Profile;
