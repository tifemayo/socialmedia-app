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
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from "react-router-dom";
import profileImg from '../../images/girl-afro (1).jpg';
import { useContext, useState, useEffect, useRef } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import SearchResults from "../searchResults/SearchResults";

const NavBar = () => {
    const { toggle, darkMode } = useContext(DarkModeContext);
    const { currentUser } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const searchResultsRef = useRef(null);

    // Fetch user data to ensure we have the latest updates
    const { data: userData } = useQuery({
        queryKey: ["user", currentUser.id],
        queryFn: () => makeRequest.get(`/users/find/${currentUser.id}`).then(res => res.data),
        enabled: !!currentUser.id
    });

    // Debounced search query
    const [debouncedQuery, setDebouncedQuery] = useState("");

    // Debounce search query to prevent excessive API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchTerm);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Get search results when debounced query changes
    const { data: searchResults, isLoading: searchLoading } = useQuery({
        queryKey: ["search", debouncedQuery],
        queryFn: () => 
            debouncedQuery.length > 0 
                ? makeRequest.get(`/posts/search?q=${debouncedQuery}`).then(res => res.data)
                : Promise.resolve([]),
        enabled: !!debouncedQuery && debouncedQuery.length > 2 // Only search when query is at least 3 characters
    });

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current && 
                !searchRef.current.contains(event.target) &&
                searchResultsRef.current && 
                !searchResultsRef.current.contains(event.target)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowResults(value.length > 0);
        setIsSearching(value.length > 0);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchTerm("");
        setShowResults(false);
        setIsSearching(false);
    };

    // Handle search submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim().length > 0) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
            setShowResults(false);
        }
    };

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
                <div className="search" ref={searchRef}>
                    <form onSubmit={handleSearchSubmit}>
                        <SearchOutlinedIcon />
                        <input 
                            type="text" 
                            placeholder="Search posts..." 
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setShowResults(searchTerm.length > 0)}
                        />
                        {isSearching && (
                            <CloseIcon 
                                className="clear-search" 
                                onClick={handleClearSearch} 
                            />
                        )}
                    </form>
                    {showResults && (
                        <div className="search-results-container" ref={searchResultsRef}>
                            <SearchResults 
                                results={searchResults || []} 
                                loading={searchLoading} 
                                query={debouncedQuery}
                                onResultClick={() => setShowResults(false)}
                            />
                        </div>
                    )}
                </div>
                <PersonOutlinedIcon/>
                <ChatBubbleRoundedIcon/>
                <NotificationsOutlinedIcon/>
                <Link to={`/profile/${currentUser.id}`} style={{textDecoration:"none", color: "inherit"}}>
                    <div className="user">
                        <img src={getImageUrl(displayUser.profilePic)} alt="" />
                        <span>{displayUser.name}</span>
                    </div>
                </Link>
            </div>
        </div>
      
    )

}

export  default NavBar;