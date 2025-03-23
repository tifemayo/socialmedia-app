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


const NavBar = () => {
    const { toggle, darkMode } = useContext(DarkModeContext);
    const { currentUser } = useContext(AuthContext);

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
                    <img src={currentUser.profilePic} alt="" />
                    <span>{currentUser.name}</span>
                </div>
            </div>
        </div>
      
    )

}

export  default NavBar;