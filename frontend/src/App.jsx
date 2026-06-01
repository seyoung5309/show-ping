import { useState } from 'react'
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PingMain from "./pages/PingMain";
import PingGroup from "./pages/PingGroup";
import PingAddUpdate from "./pages/PingAddUpdate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<PingMain />} />
        <Route path="/group/:id" element={<PingGroup />} />
        <Route path="/ping/add" element={<PingAddUpdate />} />
        <Route path="/ping/update/:id" element={<PingAddUpdate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;