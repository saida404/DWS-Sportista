import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SignupForm from "../components/SignupForm";
import Footer from "../components/Footer";


function SignupPage() {
 
    return (
      <div className="text-gray-600 font-mono">
        <div className="grid md:grid-cols-3">
          <Navbar />
          <SignupForm/>
        </div>
        <Footer/>
      </div>
    );
  }

export default SignupPage;
