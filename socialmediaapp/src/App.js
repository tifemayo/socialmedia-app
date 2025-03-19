import React from 'react';
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import PlatformSelection from "./pages/platforms/PlatformSelection";

import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
  Outlet,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home"
import Profile from "./pages/profile/Profile"
import NavBar from './components/navbar/navbar';
import RightBar from './components/rightbar/rightbar';
import LeftBar from './components/leftbar/leftbar';
import "./style.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";





function App() {

  const {currentUser} = useContext(AuthContext);
  
  const { darkMode } = useContext(DarkModeContext);

  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <NavBar />
          <div style ={{ display: "flex"}}>
            <LeftBar />
            <div style={{ flex: 6 }}>
               <Outlet />
            </div>
            <RightBar />
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  //Checks if user is logged in to see profile page
  const  ProtectedRoute = ({children}) =>{
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };
  const Router = createBrowserRouter([
    {
      path: "/",
      element:(
      <ProtectedRoute>
          <Layout />
      </ProtectedRoute>
      ),
      children:[
        {
          path:"/",
          element:<Home />
        }, 
        {
          path:"/profile/:id",
          element:<Profile />
        }, 
      ]
    },
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "/register",
      element: <Register/>,
    },
    {
      path: "/platforms",
      element: <PlatformSelection />,
    },
  ]);
  
  
  return (
    <div >
      <RouterProvider router={Router} />
    </div>
   
  );
}

export default App;
