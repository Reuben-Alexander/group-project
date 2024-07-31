import { AuthProvider } from "./AuthProvider";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./firebase_setup/Signin";
import Signup from "./firebase_setup/Signup";
import Profile from "./firebase_setup/Profile";
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />,
          <Route path="login" element={<Login />} />,
          <Route path="Signup" element={<Signup />} />,
          <Route path="Profile" element={<Profile />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>,
  </React.StrictMode>,
  document.getElementById("root")
);





