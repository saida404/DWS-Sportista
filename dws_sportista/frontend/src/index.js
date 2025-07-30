import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ManagerReqPage from "./pages/ManagerReqPage";
import { AuthProvider } from "./AuthProvider";
import AdminPage from "./pages/AdminPage";
import ManagerPage from "./pages/ManagerPage";
import ReservationPage from "./pages/ReservationPage";
import UserProfilePage from "./pages/UserProfilePage";
import TerminiPage from "./pages/TerminiPage";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage />},
  { path: "/home", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/postanimenadzer", element: <ManagerReqPage /> },
  { path: "/admin", element: <AdminPage/> },
  { path: "/manager", element: <ManagerPage/> },
  { path: "/reservation/:courtId", element: <ReservationPage/> },
  { path: "/userprofilepage", element: <UserProfilePage/>},
  {path: "/termini", element: <TerminiPage/>}
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
