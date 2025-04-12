import { useState } from "react";
import { makeRequest } from "../../axios";
import "./edit.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Edit = ({ setOpenEdit, user}) => {
  const queryClient = useQueryClient();
  const { currentUser, updateUser } = useContext(AuthContext);
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  
  const [texts, setTexts] = useState({
    email: user?.email || "",
    password: user?.password || "",
    name: user?.name || "",
    username: user?.username || "",
    city: user?.city || "",
    platform: user?.platform || "",
  });

  const upload = async (file) => {
    console.log(file)
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
      // Invalidate and refetch
      queryClient.invalidateQueries(["user"]);
    }
  });

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    let coverUrl;
    let profileUrl;
    
    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;
    
    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenEdit(false);
    setCover(null);
    setProfile(null);
  }; 

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
                  src={cover ? URL.createObjectURL(cover) : "/upload/" + user.coverPic}
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
                  src={profile ? URL.createObjectURL(profile) : "/upload/" + user.profilePic}
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
          <label>City</label>
          <input 
            type="text" 
            name="city" 
            onChange={handleChange}
            value={texts.city}
          />
          <label>Platform</label>
          <input 
            type="text" 
            name="platform" 
            onChange={handleChange}
            value={texts.platform}
          />
          <button onClick={handleSubmit}>Save Changes</button>
        </form>
        <button className="close" onClick={() => setOpenEdit(false)}>X</button>
      </div>
    </div>
  );
};

export default Edit;
