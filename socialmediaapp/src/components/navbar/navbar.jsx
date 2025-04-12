import "./navbar.scss"
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import AppsSharpIcon from '@mui/icons-material/AppsSharp';
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import profileImg from '../../images/girl-afro (1).jpg';
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const NavBar = () => {
    const { toggle, darkMode } = useContext(DarkModeContext);
    const { currentUser } = useContext(AuthContext);

    // Fetch user data to ensure we have the latest updates
    const { data: userData } = useQuery({
        queryKey: ["user", currentUser.id],
        queryFn: () => makeRequest.get(`/users/find/${currentUser.id}`).then(res => res.data),
        enabled: !!currentUser.id
    });

    // if an image needs the /upload/ prefix
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";
        // If the path already starts with http or /, return as is
        if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
            return imagePath;
        }
        // Otherwise, add the /upload/ prefix
        return "/upload/" + imagePath;
    };

    // Use userData if available, otherwise fall back to currentUser
    const displayUser = userData || currentUser;

    return(
        <div className="navbar"> 
            <div className="left">
                <Link to ="/"  className="logo-link" style={{textDecoration:"none"}}>
                    <span>Unifeed</span>
                </Link>
                <Link to ="/"  style={{textDecoration:"none"}}>
                    <HomeRoundedIcon/>
                </Link>
               
                
                {darkMode ? (
                    <WbSunnyOutlinedIcon onClick={toggle} />
                ) : (
                    <DarkModeOutlinedIcon onClick={toggle} />
                )}
                <WidgetsRoundedIcon />
            </div>   
            <div className="right">
                <div className="search">
                    <SearchOutlinedIcon />
                    <input type="text"  placeholder="Search..."/>
                </div>
                <PersonOutlinedIcon/>
                <ChatBubbleRoundedIcon/>
                <NotificationsOutlinedIcon/>
                <div className="user">
                    <img src={getImageUrl(displayUser.profilePic)} alt="" />
                    <span>{displayUser.name}</span>
                </div>
            </div>
        </div>
      
    )

}

export  default NavBar;