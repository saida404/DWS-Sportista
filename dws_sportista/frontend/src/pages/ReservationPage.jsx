import React from "react";
import Reservation from "../components/Reservation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


function ReservationPage() {
    return(
        <div className="text-gray-600 font-mono">
        <div className="grid md:grid-cols-3">
          <Navbar />
          <Reservation />
        </div>
        <Footer/>
      </div>
    )

}

export default ReservationPage;
