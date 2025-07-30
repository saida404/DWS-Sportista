import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import TerminiTable from "./TerminiTable";

const UserCard = ({ first_name, last_name, username, email, city, fitness_level, preferred_sport, matches_played, merit }) => {
  const { isLoggedIn, logout, userData } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);

  
  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };


  useEffect(() => {
    const fetchReservations = async () => {
      if (userData) {
        try {
          const response = await fetch("http://localhost:8000/reservations/user", {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setReservations(data);
          } else {
            console.log("Failed to fetch reservations");
          }
        } catch (error) {
          console.error("Error fetching reservations", error);
        }
      }
    };

    fetchReservations();
  }, [userData]);

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view this page.</p>
          <Link to="/login" className="text-primary btn border md:border-2 hover:bg-gray-400 hover:text-white">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="px-4 sm:px-16 py-6 bg-gray-100 md:col-span-2">
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
              <button
                className="text-primary btn border md:border-2 hover:bg-gray-400 hover:text-white"
                onClick={logout}
              >
                 <Link to="/" className="text-red-600 font-bold">
                Odjavi se
                </Link>
          </button>
             
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

      <section className="mt-3 mb-2 border bg-neutral-100 p-4 rounded-lg max-w-full flex justify-center items-center">
        <div className="mx-auto justify-center">
          <div className="card md:flex max-w-lg">
            <div className="w-20 h-20 mx-auto mb-6 md:mr-6 flex-shrink-0">
              <img className="object-cover rounded-full" src="https://tailwindflex.com/public/images/user.png" alt="User"/>
            </div>
            <div className="flex-grow text-center md:text-left">
              <p>@{username}</p>
              <p><span className="font-bold">Ime:</span> {first_name}</p>
              <h3><span className="font-bold">Prezime:</span> {last_name}</h3>
              <p className="mt-2 mb-3"><span className="font-bold">E-mail:</span> {email}</p>
              <div className="mb-3">
                <span className="bg-gray-200 border px-3 py-1.5 rounded-lg text-sm mr-2">{fitness_level}</span>
                <span className="bg-gray-200 border px-3 py-1.5 rounded-lg text-sm mr-2">{preferred_sport}</span>
                <span className="bg-gray-200 border px-3 py-1.5 rounded-lg text-sm mr-2">{city}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div>
        <h4 className="font-bold mt-12 pb-2 border-b border-color-gray-200">Informacije o mečevima</h4>
        <div className="mt-8 grid lg:grid-cols-3 gap-10">
          <div className="card text-center flex flex-col justify-center items-center">
            <h4 className="text-xl font-semibold">Merit</h4>
            <div className="m-4">
              <h2 className="text-2xl">{merit}</h2>
            </div>
          </div>
          <div className="card text-center flex flex-col justify-center items-center">
            <h4 className="text-xl font-semibold">Broj odigranih</h4>
            <div className="m-4">
              <h2 className="text-2xl">{matches_played}</h2>
            </div>
          </div>
          <div className="card text-center flex flex-col justify-center items-center">
            <h4 className="text-xl font-semibold">Broj prijavljenih</h4>
            <div className="m-4">
              <h2 className="text-2xl">0</h2>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-bold mt-12 pb-2 border-b border-color-gray-200 mb-2">Prijavljeni termini</h4>
        <TerminiTable reservations={reservations} setReservations={setReservations} token={userData.token}/>
      </div>
    </main>
  );
};

export default UserCard;
