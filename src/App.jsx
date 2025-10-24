import { useState } from 'react';
import { BrowserRouter,Routes, Route  } from "react-router-dom";
import LandingPage from "@pages/LandingPage"
import UsersDashboard from "@/pages/UserDashboard"
import Login from "@pages/Login"
import Register from "@pages/Register"

import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/"  element={<LandingPage/>}/>
        <Route path="/login"  element={<Login/>}/>
        <Route path="/register"  element={<Register/>}/>
      </Routes>

       </BrowserRouter>
       <UsersDashboard/>
    </>
  )
}

export default App
