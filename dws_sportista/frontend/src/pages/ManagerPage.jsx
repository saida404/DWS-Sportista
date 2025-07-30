import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ManagerPanel from "../components/ManagerPanel";
import Footer from "../components/Footer";

function ManagerPage() {

    return (
      <div className="text-gray-600 font-mono">
        <div className="grid md:grid-cols-3">
          <Navbar />
          <ManagerPanel/>
        </div>
        <Footer/>
      </div>
    );
  }

export default ManagerPage;
