import React from 'react';
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
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




function App() {

  const activeUser = true;

  const Layout = () => {
    return (
     
        <div>
          <NavBar />
          <div style ={{ display: "flex"}}>
            <LeftBar />
            <Outlet />
            <RightBar />
          </div>
        </div>
    );
  };

  //Checks if user is logged in to see profile page
  const  ProtectedRoute = ({children}) =>{
    if (!activeUser){
      return <Navigate to="/login"/>

    }
    return children
  }
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
  ]);
  
  
  return (
    <div >
      <RouterProvider router={Router} />
    </div>
   
  );
}

export default App;
