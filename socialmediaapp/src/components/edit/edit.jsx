import { useState } from "react";
import { makeRequest } from "../../axios";
import "./edit.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Edit = ({ setOpenEdit, user}) => {
  const queryClient = useQueryClient();
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  

  const [texts, setTexts] = useState({
    email: user?.email || "",
    password: user?.password || "",
    name: user?.name || "",
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

  //Handles user data change on profile 
  const mutation = useMutation({
    mutationFn: (userData) => {
      return makeRequest.put("/users", userData);
    },
    onSuccess: () => {
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
      Edit
      <form>
        <input type="file" />
        <input type="file" />
        <input type="text" name="name" onChange={handleChange}/>
        <input type="text" name="city" onChange={handleChange} />
        <input type="text" name="platform" onChange={handleChange}/>
        <button onClick={handleSubmit}> Finish Edit</button>

      </form>
      <button onClick={() => setOpenEdit(false)}>X</button>
    </div>
  );
};

export default Edit;
