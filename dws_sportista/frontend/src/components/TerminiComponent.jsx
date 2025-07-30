import React, { useContext, useState, useEffect } from "react";
import Card from "./Card";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import TerminCard from "./TerminCard";

function TerminiComponent() {
  const { isLoggedIn, logout, userData } = useContext(AuthContext);
  const [footbalTerms, setFootbalTerms] = useState([]);
  const [basketballTerms, setBasketballTerms] = useState([]);
  const [volleyballTerms, setVoleyballTerms] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };



  useEffect(() => {
    const fetchAllFootballTerms = async () => {
        try {
          const response = await fetch("http://localhost:8000/appointments/football");
          if (response.ok) {
            const data = await response.json();
            setFootbalTerms(data); // Vraćamo podatke ako je zahtjev uspješan
          } else {
            console.error("Failed to fetch football appointments");
            return []; // Vraćamo prazan niz ako je došlo do greške
          }
        } catch (error) {
          console.error("Error fetching football appointments:", error);
          return []; // Vraćamo prazan niz ako je došlo do greške
        }
    }

    const fetchAllBasketballTerms = async () => {
        try {
          const response = await fetch("http://localhost:8000/appointments/basketball");
          if (response.ok) {
            const data = await response.json();
           setBasketballTerms(data); // Vraćamo podatke ako je zahtjev uspješan
          } else {
            console.error("Failed to fetch basketball appointments");
            return []; // Vraćamo prazan niz ako je došlo do greške
          }
        } catch (error) {
          console.error("Error fetching basketball appointments:", error);
          return []; // Vraćamo prazan niz ako je došlo do greške
        }
    }
    const fetchAllVolleyballTerms = async () => {
        try {
          const response = await fetch("http://localhost:8000/appointments/volleyball");
          if (response.ok) {
            const data = await response.json();
            setVoleyballTerms(data); // Vraćamo podatke ako je zahtjev uspješan
          } else {
            console.error("Failed to fetch volleyball appointments");
            return []; // Vraćamo prazan niz ako je došlo do greške
          }
        } catch (error) {
          console.error("Error fetching volleyball appointments:", error);
          return []; // Vraćamo prazan niz ako je došlo do greške
        }
    }

    fetchAllFootballTerms();
    fetchAllBasketballTerms();
    fetchAllVolleyballTerms();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false 
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  

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

      <header className="text-center">
        <h2 className="text-grey-700 text-4xl sm:text-6xl font-semibold my-4">Sportsman</h2>
        <h3 className="text-xl sm:text-2xl font-semibold">Postani dio ekipe!</h3>
      </header>

      <div>
        <h4 className="mt-12 pb-2 border-b border-color-gray-200">
            Futbal
        </h4>
        <div className="mt-8 grid lg:grid-cols-3 gap-10">
            {isLoggedIn ? (
            footbalTerms.map((court) => (
                <Link to={`/reservation/${court.id}`}>
                    <TerminCard
                        key={court.id}
                        name={court.name}
                        location={court.location}
                        sport={court.sport}
                        imageLink={court.image_link}
                        courtType={court.court_type}
                        startTime={formatDate(court.start_time)}
                    />
                </Link>
            ))
            ) : (
                footbalTerms.slice(0, 3).map((court) => (
                <Link to={`/reservation/${court.id}`}>

                <TerminCard
                  key={court.id}
                  name={court.name}
                  location={court.location}
                  sport={court.sport}
                  imageLink={court.image_link}
                  courtType={court.court_type}
                  startTime={formatDate(court.start_time)}

                />
                </Link>
            ))
            )}
        </div>
      </div>

      <h4 className="mt-12 pb-2 border-b border-color-gray-200">
        Košarka
      </h4>
      <div className="mt-8 grid lg:grid-cols-3 gap-10">
        {isLoggedIn ? (
          basketballTerms.map((court) => (
            <Link to={`/reservation/${court.id}`}>
              <TerminCard
                key={court.id}
                name={court.name}
                location={court.location}
                sport={court.sport}
                imageLink={court.image_link}
                courtType={court.court_type}
                startTime={formatDate(court.start_time)}
              />
              </Link>
          ))
        ) : (
            basketballTerms.slice(0, 3).map((court) => (
            <Link to={`/reservation/${court.id}`}>

              <TerminCard
                 key={court.id}
                 name={court.name}
                 location={court.location}
                 sport={court.sport}
                 imageLink={court.image_link}
                 courtType={court.court_type}
                 startTime={formatDate(court.start_time)}

              />
            </Link>
          ))
        )}
      </div>

      
      <h4 className="mt-12 pb-2 border-b border-color-gray-200">
        Odbojka
      </h4>
      <div className="mt-8 grid lg:grid-cols-3 gap-10">
        {isLoggedIn ? (
          volleyballTerms.map((court) => (
            <Link to={`/reservation/${court.id}`}>
              <TerminCard
                 key={court.id}
                 name={court.name}
                 location={court.location}
                 sport={court.sport}
                 imageLink={court.image_link}
                 courtType={court.court_type}
                 startTime={formatDate(court.start_time)}
              />
              </Link>
          ))
        ) : (
            volleyballTerms.slice(0, 3).map((court) => (
            <Link to={`/reservation/${court.id}`}>

              <TerminCard
                key={court.id}
                name={court.name}
                location={court.location}
                sport={court.sport}
                imageLink={court.image_link}
                courtType={court.court_type}
                startTime={formatDate(court.start_time)}

              />
            </Link>
          ))
        )}
      </div>

      {!isLoggedIn && (
        <div className="flex justify-center mt-4">
          <div className="text-primary btn border md:border-2 hover:bg-gray-400 hover:text-white">
            <Link to={"/login"}>Login to view all courts</Link>
          </div>
        </div>
      )}
    </main>
  );
};

export default TerminiComponent;
