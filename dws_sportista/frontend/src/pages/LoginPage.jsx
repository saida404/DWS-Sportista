import React, { useState } from "react";
import Navbar from "../components/Navbar";
import LoginForm from "../components/LoginForm";
import Footer from "../components/Footer";


function LoginPage() {
 
    return (
      <div className="text-gray-600 font-mono">
        <div className="grid md:grid-cols-3">
          <Navbar />
          <LoginForm/>
        </div>
        <Footer/>
      </div>
    );
  }

export default LoginPage;
