import React from 'react';
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  
  
  return (
    // <div >
    //   <RouterProvider router={router} />
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
// const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Navigate to="/login" />,
  //   },
  //   {
  //     path: "/login",
  //     element: <Login/>,
  //   },
  //   {
  //     path: "/register",
  //     element: <Register/>,
  //   },
  // ]);
export default App;
