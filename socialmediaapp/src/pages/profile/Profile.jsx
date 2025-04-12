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
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Edit from "../../components/edit/edit";
import { useState } from "react";

const Profile = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const { currentUser } = useContext(AuthContext);
 

 // extracts the userId from the URL pathname using the useLocation hook
  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const queryClient = useQueryClient();
 
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
  // In your Profile.jsx file
  
  // Update the mutation implementation
  const mutation = useMutation({
    mutationFn: (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      // Invalidate and refetch
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


  return (
    <div className="profile">
       {userLoading ? (
        "loading"
      ) : (
        <>
        <div className="images">
          <img
            src= {"/upload/" + userData?.coverPic || "/default-cover.jpg"}
            alt=""
            className="cover"
          />
          <img
            src={"/upload/" + userData?.profilePic || "/default-cover.jpg"}
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
              </div>
            { relationshipLoading ? (
                  "loading"
                ) : (
              userId === currentUser.id ? (
                  <button onClick={() => setOpenEdit(true)}>Edit Profile</button>
              ) : <button onClick={handleFollow}>{relationshipData.includes(currentUser.id)
                ? "Following"
                : "Follow"}</button>
           ) } 
            </div>
            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
        <Posts userId={userId}/>
        </div>
        </>
      )}
      {openEdit && <Edit setOpenEdit={setOpenEdit} user={userData}/>}
    </div>
  );
};

export default Profile;
