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
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Edit from "../../components/edit/edit";
import defaultAvatar from "../../images/default.jpeg";

const Profile = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const { currentUser } = useContext(AuthContext);
 

 // extracts the userId from the URL pathname using the useLocation hook
  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const queryClient = useQueryClient();
  
  // Scroll to top whenever profile page is loaded or userId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [userId]);
 
  // uses useQuery hook to fetch user data 
  const { isLoading: userLoading, error, data: userData } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => makeRequest.get(`/users/find/${userId}`).then(res => res.data),
  });

  // // uses to fetch followers from backend DB
  const { isLoading: relationshipLoading, data: relationshipData } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: () => makeRequest.get(`/relationships?followedUserId=${userId}`).then(res => res.data),
  });
  console.log(relationshipData);

  // mutation to follow a user
  const mutation = useMutation({
    mutationFn: (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["relationship"]);
    },
  });

  //function to handle follow user request
  const handleFollow = async () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };
  
  // query to Fetch / get a socialmedia user's integrated platforms , using current userID from local storage 
  if (userLoading ) return "Loading...";
  if (error) return "Error loading profile";
  if (!userData) return "No user data found";

  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === "null" || imagePath.trim() === "") {
      return defaultAvatar;
    }
    
    if (imagePath.startsWith('http') || imagePath.startsWith('/upload/')) {
      return imagePath;
    }
    
    return `/upload/${imagePath}`;
  };

  return (
    <div className="profile">
      {userLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img
              src={getImageUrl(userData?.coverPic)}
              alt="Cover"
              className="cover"
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
            <img
              src={getImageUrl(userData?.profilePic)}
              alt={userData?.name || "Profile"}
              className="profilePic"
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
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
                    <span>{userData.city || "No location set"}</span>
                  </div>
                </div>
                {relationshipLoading ? (
                  "loading"
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenEdit(true)}>Edit Profile</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openEdit && <Edit setOpenEdit={setOpenEdit} user={userData} />}
    </div>
  );
};

export default Profile;
