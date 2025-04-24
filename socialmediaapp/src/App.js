import React from 'react';
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import PlatformSelection from "./pages/platforms/PlatformSelection";
import SearchPage from "./pages/search/SearchPage";

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
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
        <div className={`theme-${darkMode ? "dark" : "light"}`} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <NavBar />
          <div style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 70px)" }}>
            <LeftBar />
            <div style={{ flex: 6, minHeight: "100%" }}>
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
  const router = createBrowserRouter(
    [
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
          {
            path:"/search",
            element:<SearchPage />
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
    ],
    {
      future: {
        v7_skipActionErrorRevalidation: true
      }
    }
  );
  
  
  return (
    <div >
      <RouterProvider router={router} />
    </div>
   
  );
}

export default App;
