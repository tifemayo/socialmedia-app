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


const NavBar = () => {
    return(
        <div className="navbar"> 
            <div className="left">
            <Link to ="/" style={{textDecoration:"none"}}>
                <span>UniFEED</span>
            
            </Link>
            <HomeRoundedIcon/>
                <DarkModeOutlinedIcon/>
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
                    <img src={profileImg} alt="" />
                    <span>Tife Mayo</span>
                </div>
            </div>
        </div>
      
    )

}

export  default NavBar;