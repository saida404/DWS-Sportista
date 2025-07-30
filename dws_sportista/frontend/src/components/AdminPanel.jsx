import React, {useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import ManagersTable from "./ManagersTable";
import ManagerRequestTable from "./ManagerRequestTable";
import TereniTable from "./TereniTable";
import DodajTerenForm from "./DodajTerenForm";
import TerminiTable from "./TerminiTable";
import DodajTerminForm from "./DodajTerminForm"
import KorisniciTable from "./KorisniciTable";
import { AuthContext } from "../AuthProvider";

const AdminPanel = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [courtCount, setCourtCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const { isLoggedIn, userData, logout } = useContext(AuthContext);
  const [openSection, setOpenSection] = useState(null);

  const toggleAccordionSection = (sectionId) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };
  
  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

 

  const fetchUserCount = async () => {
      try {
          const response = await fetch("http://localhost:8000/users/count");
          if (response.ok) {
              const data = await response.json();
              setUserCount(data.user_number);
          } else {
              console.error("Failed to fetch user count");
          }
      } catch (error) {
          console.error("Error fetching user count:", error);
      }
  }

  const fetchCourtCount = async () => {
    try {
        const response = await fetch("http://localhost:8000/courts/count");
        if (response.ok) {
            const data = await response.json();
            setCourtCount(data.court_number);
        } else {
            console.error("Failed to fetch court count");
        }
    } catch (error) {
        console.error("Error fetching court count:", error);
    }
}


const fetchAppointmentCount = async () => {
  try {
      const response = await fetch("http://localhost:8000/appointments/count");
      if (response.ok) {
          const data = await response.json();
          setAppointmentCount(data.appointment_number);
      } else {
          console.error("Failed to fetch appointments count");
      }
  } catch (error) {
      console.error("Error fetching appointments count:", error);
  }
}
 
  useEffect(() => {
    fetchUserCount();
    fetchCourtCount();
    fetchAppointmentCount();
}, []);

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


      <header>
        <h2 className="text-grey-700 text-6xl font-semibold mt-4">
          Dobrodošao, Admin!
        </h2>
      </header>

      <div>
        <h4 className="font-bold mt-12 pb-2 border-b border-color-gray-200">
          Posljednji presjek stanja
        </h4>

        <div className="mt-8 grid lg:grid-cols-3 gap-10">
         
          <div className="card text-center flex flex-col justify-center items-center">
            <h4 className="text-xl font-semibold">Trenutni broj korisnika</h4>
            <div className="m-4">
              <h2 className="text-2xl">{userCount}</h2>
            </div>
          </div>

          <div className="card text-center flex flex-col justify-center items-center">
            <h4 className="text-xl font-semibold">Trenutni broj terena</h4>
            <div className="m-4">
              <h2 className="text-2xl">{courtCount}</h2>
            </div>
          </div>

          <div className="card text-center flex flex-col justify-center items-center">
            <h4 className="text-xl font-semibold">Broj termina</h4>
            <div className="m-4">
              <h2 className="text-2xl">{appointmentCount}</h2>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mt-12 pb-2 border-b border-color-gray-200 font-bold">
        Menadžeri
      </h4>
      <div className="mt-8">
        <ManagersTable />
      </div>
      <h4 className="mt-12 pb-2 border-b border-color-gray-200 font-bold">
        Korisnici
      </h4>
      <div className="mt-8">
        <KorisniciTable />
      </div>


      <h4 className="mt-12 pb-2 border-b border-color-gray-200 font-bold">
        Zahtjevi za menadžere
      </h4>
      <div className="mt-8">
        <ManagerRequestTable />
      </div>

      <h4 className="mt-12 pb-2 border-b border-color-gray-200 font-bold">
        Tereni
      </h4>
      <div className="mt-8">
        <TereniTable />
      </div>
      
      <h4 className="mt-12 pb-2 border-b border-color-gray-200 font-bold">
        Termini
      </h4>
      <div className="mt-8">
        <TerminiTable />
      </div>

      <h2 className="mt-12 text-2xl pb-2 border-b border-color-gray-200 font-bold">
        Forme
      </h2>

      
      <div id="accordion-collapse" data-accordion="collapse">
  <h2 id="accordion-collapse-heading-2">
    <button
      type="button"
      onClick={() => toggleAccordionSection(2)}
      className={`flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 ${
        openSection === 2 ? 'bg-gray-100 dark:bg-gray-800' : ''
      }`}
      data-accordion-target="#accordion-collapse-body-2"
      aria-expanded={openSection === 2 ? 'true' : 'false'}
      aria-controls="accordion-collapse-body-2"
    >
      <span>Dodaj Teren</span>
      <svg
        data-accordion-icon
        className={`w-3 h-3 rotate-180 shrink-0 ${
          openSection === 2 ? 'transform rotate-0' : ''
        }`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5 5 1 1 5"
        />
      </svg>
    </button>
  </h2>
  <div
    id="accordion-collapse-body-2"
    className={`p-5 border border-b-0 border-gray-200 dark:border-gray-700 ${
      openSection === 2 ? 'block' : 'hidden'
    }`}
    aria-labelledby="accordion-collapse-heading-2"
  >
    <DodajTerenForm />
  </div>

  <h2 id="accordion-collapse-heading-3">
    <button
      type="button"
      onClick={() => toggleAccordionSection(3)}
      className={`flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 ${
        openSection === 3 ? 'bg-gray-100 dark:bg-gray-800' : ''
      }`}
      data-accordion-target="#accordion-collapse-body-3"
      aria-expanded={openSection === 3 ? 'true' : 'false'}
      aria-controls="accordion-collapse-body-3"
    >
      <span>Dodaj Termin</span>
      <svg
        data-accordion-icon
        className={`w-3 h-3 rotate-180 shrink-0 ${
          openSection === 3 ? 'transform rotate-0' : ''
        }`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5 5 1 1 5"
        />
      </svg>
    </button>
  </h2>
  <div
    id="accordion-collapse-body-3"
    className={`p-5 border border-t-0 border-gray-200 dark:border-gray-700 ${
      openSection === 3 ? 'block' : 'hidden'
    }`}
    aria-labelledby="accordion-collapse-heading-3"
  >
    <DodajTerminForm />
  </div>

</div>

     
        
    </main>
  );
};

export default AdminPanel;
