import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HomeComponent from "../components/HomeComponent";
import Footer from "../components/Footer";

function HomePage() {
 
    return (
      <div className="text-gray-600 font-mono">
        <div className="grid md:grid-cols-3">
          <Navbar />
          <HomeComponent />
        </div>
        <Footer/>
      </div>
    );
  }

export default HomePage;
