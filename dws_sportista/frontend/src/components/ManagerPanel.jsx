import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import DodajTerenForm from "./DodajTerenForm";
import DodajTerminForm from "./DodajTerminForm";

const ManagerPanel = () => {
  const { isLoggedIn, userData } = useContext(AuthContext);
  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };
  return (
    <main className="px-16 py-6 bg-gray-100 md:col-span-2">
         {/* Popup za odjavu */}
         {isPopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-lg font-bold mb-4">
              Jeste li sigurni da se želite odjaviti?
            </h2>
            <div className="flex justify-end">
              <button className="text-primary mr-4" onClick={closePopup}>
                Odustani
              </button>
              <Link to="/" className="text-red-600 font-bold">
                Odjavi se
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center sm:justify-center md:justify-end">
        {isLoggedIn ? (
          <button
            className="text-primary btn border md:border-2 hover:bg-gray-400 hover:text-white"
            onClick={openPopup}
          >
            Sign out
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="text-primary btn border md:border-2 hover:bg-gray-400 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-primary ml-2 btn border md:border-2 hover:bg-gray-400 hover:text-white"
            >
              Sign up
            </Link>
          </>
        )}
      </div>

      <header>
        <h2 className="text-grey-700 text-6xl font-semibold mt-4">
          Welcome, Manager!
        </h2>
      </header>

      

      <div className="flex flex-col items-center mt-12">
        <h2 className="text-2xl pb-2 border-b border-gray-200 font-bold">
          Forms
        </h2>

        <h3 className="text-xl font-semibold mt-5">Add Court</h3>
        <div className="mt-8 w-full flex justify-center">
          <DodajTerenForm />
        </div>

        <h3 className="text-xl font-semibold border-t border-gray-200 mt-6">
          Add Appointment
        </h3>
        <div className="mt-8 w-full flex justify-center">
          <DodajTerminForm />
        </div>
      </div>
    </main>
  );
};

export default ManagerPanel;
