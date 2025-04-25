import "./rightbar.scss"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import defaultAvatar from "../../images/default.jpeg";
import { Link } from "react-router-dom";

const RightBar = () => {
    const { currentUser } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Fetch suggested users
    const { data: suggestedUsers } = useQuery({
        queryKey: ["suggestedUsers", currentUser.id],
        queryFn: () => makeRequest.get(`/users/suggestions?userId=${currentUser.id}`).then(res => {
            console.log("Suggestions response:", res.data); // Debug log
            return res.data;
        })
    });

    // Fetch users that currentUser follows
    const { data: following } = useQuery({
        queryKey: ["following", currentUser.id],
        queryFn: () => makeRequest.get(`/relationships?followerUserId=${currentUser.id}`).then(res => res.data)
    });

    const getImageUrl = (imagePath) => {
        if (!imagePath || imagePath === "null" || imagePath.trim() === "") {
            return defaultAvatar;
        }
        
        if (imagePath.startsWith('http') || imagePath.startsWith('/upload/')) {
            return imagePath;
        }
        
        return `/upload/${imagePath}`;
    };

    // Follow/Unfollow mutation
    const mutation = useMutation({
        mutationFn: (userId) => makeRequest.post("/relationships", { userId }),
        onSuccess: () => {
            queryClient.invalidateQueries(["suggestedUsers"]);
        },
    });

    return (
        <div className="rightBar">
            <div className="container">
                <div className="item">
                    <span>Suggestions For You</span>
                    {suggestedUsers?.map(user => (
                        <div className="user" key={user.id}>
                            <div className="userInfo">
                                <Link to={`/profile/${user.id}`}>
                                    <img src={getImageUrl(user.profilePic)} alt={user.name} />
                                </Link>
                                <span>{user.name}</span>
                            </div>
                            <div className="buttons">
                                <button onClick={() => mutation.mutate(user.id)}>follow</button>
                                <button>dismiss</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="item">
                    <span>People You Follow</span>
                    {following?.map(user => (
                        <div className="user" key={user.id}>
                            <div className="userInfo">
                                <Link to={`/profile/${user.id}`}>
                                    <img src={getImageUrl(user.profilePic)} alt={user.name} />
                                    <span>{user.name}</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RightBar;