import React, { useState } from "react";
import Navbar from "../components/Navbar";
import LoginForm from "../components/LoginForm";
import Footer from "../components/Footer";
import TerminiComponent from "../components/TerminiComponent";


function TerminiPage() {
 
    return (
      <div className="text-gray-600 font-mono">
        <div className="grid md:grid-cols-3">
          <Navbar />
          <TerminiComponent/>
        </div>
        <Footer/>
      </div>
    );
  }

export default TerminiPage;
