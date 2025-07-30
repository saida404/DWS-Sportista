import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ManagerForm from "../components/ManagerForm";
import Footer from "../components/Footer";


function ManagerReqPage() {
 
    return (
      <div className="text-gray-600 font-mono">
        <div className="grid md:grid-cols-3">
          <Navbar />
          <ManagerForm/>
        </div>
        <Footer/>
      </div>
    );
  }

export default ManagerReqPage;
