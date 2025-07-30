import React, { useContext, useState, useEffect } from "react";
import Card from "./Card";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

function HomeComponent() {
  const { isLoggedIn, logout, userData } = useContext(AuthContext);
  const [latestCourts, setLatestCourts] = useState([]);
  const [allCourts, setAllCourts] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);

  console.log(userData);

    
  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

 

  useEffect(() => {
    const fetchLatestCourts = async () => {
      try {
        const response = await fetch("http://localhost:8000/courts/latest");
        if (response.ok) {
          const data = await response.json();
          setLatestCourts(data);
        } else {
          console.error("Failed to fetch latest courts");
        }
      } catch (error) {
        console.error(error);
      }
    }

    const fetchAllCourts = async () => {
      try {
        const response = await fetch("http://localhost:8000/courts/all");
        if (response.ok) {
          const data = await response.json();
          setAllCourts(data);
        } else {
          console.error("Failed to fetch all courts")
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchLatestCourts();
    fetchAllCourts();
  }, []);

  

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
              to={"/login"}
              className="text-primary btn border md:border-2 hover:bg-gray-400 hover:text-white"
            >
              Login
            </Link>
            <Link
              to={"/signup"}
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
        <h4 className="font-bold mt-12 pb-2 border-b border-color-gray-200">
          Recently added
        </h4>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {latestCourts.map((court) => (
          <Link to={`/reservation/${court.id}`}>
              <Card
                key={court.id}
                name={court.name}
                location={court.city}
                sport={court.sports.join(", ")}
                imageLink={court.image_link}
                courtType={court.court_type}
              /> 
            </Link>
          ))}
        </div>
      </div>

      <h4 className="mt-12 pb-2 border-b border-color-gray-200">
        All courts
      </h4>
      <div className="mt-8 grid lg:grid-cols-3 gap-10">
        {isLoggedIn ? (
          allCourts.map((court) => (
            <Link to={`/reservation/${court.id}`}>
              <Card
                key={court.id}
                name={court.name}
                location={court.city}
                sport={court.sports.join(", ")}
                imageLink={court.image_link}
                courtType={court.court_type}
              />
              </Link>
          ))
        ) : (
          allCourts.slice(0, 3).map((court) => (
            <Link to={`/reservation/${court.id}`}>

              <Card
                key={court.id}
                name={court.name}
                location={court.city}
                sport={court.sports.join(", ")}
                imageLink={court.image_link}
                courtType={court.court_type}
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

export default HomeComponent;
