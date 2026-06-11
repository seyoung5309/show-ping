import { useState } from 'react'
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from './pages/Splash';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PingMain from "./pages/PingMain";
import PingGroup from "./pages/PingGroup";
import PingAddUpdate from "./pages/PingAddUpdate";
import Profile from "./pages/Profile";
import SetFirst from "./pages/SetFirst";
import SetSecond from "./pages/SetSecond";
import Friends from "./pages/Friends";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <div style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
      }}>
        <div style={{
          width: "402px",
          minHeight: "100vh",
          backgroundColor: "#fff",
          border: "1px solid rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "hidden",
        }}>
          <Routes>
            <Route path="/" element={<Splash />} />       
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/main" element={<PingMain />} />
            <Route path="/group/:id" element={<PingGroup />} />
            <Route path="/ping/add" element={<PingAddUpdate />} />
            <Route path="/ping/update/:id" element={<PingAddUpdate />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/set-first" element={<SetFirst />} />
            <Route path="/set-second" element={<SetSecond />} />
            <Route path="/friends" element={<Friends />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;