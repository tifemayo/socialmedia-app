import "./leftbar.scss"
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
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import EditPlatforms from "../editPlatforms/EditPlatforms";
import EditIcon from '@mui/icons-material/Edit';

const LeftBar = () => {
    const { currentUser } = useContext(AuthContext);
    const [openEditPlatforms, setOpenEditPlatforms] = useState(false);

    // Fetch user data to ensure we have the latest updates
    const { data: userData } = useQuery({
        queryKey: ["user", currentUser.id],
        queryFn: () => makeRequest.get(`/users/find/${currentUser.id}`).then(res => res.data),
        enabled: !!currentUser.id
    });

    // Fetch user platforms using React Query
    const { data: userPlatforms = [] } = useQuery({
        queryKey: ["userPlatforms", currentUser.id],
        queryFn: async () => {
            const response = await makeRequest.get(`/platforms?userId=${currentUser.id}`);
            return response.data;
        },
        enabled: !!currentUser.id
    });

    // Helper function to determine if an image needs the /upload/ prefix
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";
        // If the path already starts with http or /, return as is
        if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
            return imagePath;
        }
        // Otherwise, add the /upload/ prefix
        return "/upload/" + imagePath;
    };

    const getPlatformImage = (platformId) => {
        switch (platformId) {
            case 'instagram':
                return Instagram;
            case 'tiktok':
                return TikTok;
            case 'unifeed':
                return Unifeed;
            default:
                console.warn(`Unknown platform: ${platformId}`);
                return null;
        }
    };

    // Use userData if available, otherwise fall back to currentUser
    const displayUser = userData || currentUser;

    return (
        <div className="leftBar">
            <div className="container">
                <div className="menu">
                    <Link to={`/profile/${displayUser.id}`} style={{textDecoration:"none"}}>
                        <div className="user">
                            <img
                                src={getImageUrl(displayUser.profilePic)}
                                alt=""
                            />
                            <span>{displayUser.username}</span>
                        </div>
                    </Link>
                    <div className="item">
                        <PeopleIcon/>
                        <span>Following</span>
                    </div>
                    <div className="item">
                        <GroupsIcon />
                        <span>Community</span>
                    </div>
                    <div className="item">
                        <BarChartIcon />
                        <span>Analytics</span>
                    </div>
                    <div className="item">
                        <AddCircleOutlineIcon/>
                        <span>Create</span>
                    </div>
                    <div className="item">
                        <NotificationsOutlinedIcon/>
                        <span>Notifications</span>
                    </div>
                    <div className="item">
                        <OndemandVideoSharpIcon />
                        <span>Videos</span>
                    </div>
                    <div className="item">
                        <ChatBubbleSharpIcon />
                        <span>Messages</span>
                    </div>
                </div>
                <hr />
                <div className="menu">
                    <div className="platforms-header">
                        <span>Your Platforms</span>
                        <EditIcon 
                            className="edit-icon" 
                            onClick={() => setOpenEditPlatforms(true)}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                    {userPlatforms.map((platform) => (
                        <div className="item" key={platform}>
                            <img src={getPlatformImage(platform)} alt={platform} />
                            <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                        </div>
                    ))}
                    {userPlatforms.length === 0 && (
                        <div className="no-platforms">
                            <span>No platforms connected</span>
                        </div>
                    )}
                </div>
                <hr />
            </div>
            {openEditPlatforms && (
                <EditPlatforms 
                    setOpenEditPlatforms={setOpenEditPlatforms}
                />
            )}
        </div>
    );
};

export default LeftBar;