import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ManagerPanel from "../components/ManagerPanel";
import Footer from "../components/Footer";
import ekipaImage from '../img/ekipa-removebg-preview.png';
import FAQImage from "../img/FAQ-removebg-preview.png"
import { Link } from "react-router-dom";


function LandingPageComponent() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
  

    return (
        <div className="container min-h-screen bg-gradient-to-r from-orange-500 to-white-500 bg-center bg-cover px-28 py-5 font-mono">
          <header className="flex justify-between px-8 py-8 items-center mb-4 justify-space-between">
            <div className="text-2xl font-bold">Sportsman</div>
            <nav className="space-x-6">
                <Link to={"/home"} className="bg-orange-400 p-3 hover:bg-orange-300 rounded">HOME</Link>
                <Link to={"/login"} className="p-3 hover:bg-orange-300 rounded">LOGIN</Link>
                <Link to={"/signup"} className="p-3 hover:bg-orange-300 rounded">SIGNUP</Link>
            </nav>
            </header>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="mt-40 max-w-xg">
              <h1 className="text-6xl font-semibold">
                Sportsman <br />
                <span className="font-normal"> Pronađi svoju ekipu! </span>
              </h1>
              <p className="mt-4">
                Sportsman je tvoj saveznik u organizaciji sportskih aktivnosti! Pronađi savršen termin za svoju omiljenu igru.
                <br /> Naša platforma ti omogućava jednostavno rezervisanje termina na terenima širom grada i pronalaženje ekipe
                za igru.
                <br /> Bez obzira da li si profesionalni sportaš ili rekreativac,
                <br /> Sportsman je tvoj ključ ka aktivnom i zabavnom životu!!
              </p>
    
              <div className="mt-10">
                <Link
                  to={"/home"}
                  className="bg-yellow-200 rounded-3xl py-3 px-8 font-medium inline-block mr-4 hover:bg-transparent hover:border-yellow-300 hover:border border border-transparent"
                >
                  Započni avanturu!
                </Link>
              </div>
            </div>
    
            <div className="mt-48 max-w-xg justify-items-center text-center hidden lg:block">
              <img className="mt-20 ml-10 lg:w-auto"  src={ekipaImage} alt="ekipa" />
            </div>
          </div>
    
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="mt-48 max-w-xg justify-items-center text-center hidden lg:block">
              <img className="mt-20 ml-10 lg:w-auto" src={FAQImage} alt="FAQ" />
            </div>
    
            <div className="mt-10">
              <section className="mt-10">
                <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                  <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Često postavljena pitanja</h2>
                  <div className="grid pt-8 text-left border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="mb-10">
                        <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                          <svg
                            className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Kako mogu rezervisati svoj termin?
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Da biste rezervisali svoj termin, potrebno je da kreirate korisnički račun, zatim odaberete željeni teren ili termin i
                          unesete potrebne podatke za rezervaciju!
                        </p>
                      </div>
                      <div className="mb-10">
                        <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                          <svg
                            className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 012 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Šta ako je termin na koji se želim prijaviti popunjen?
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                        Ukoliko je termin na koji se želite prijaviti popunjen, 
                                    možete se upiasti na listu čekanja. Ukoliko se oslobodi mjesto, mi ćemo Vas obavijestiti putem maila!
                        </p>
                      </div>
                      <div className="mb-10">
                        <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                          <svg
                            className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 012 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 000-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Da li mogu prijaviti više članova ekipe?
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                        Naravno! Potrebno je da prilikom rezervacije termine unesete
                        broj članova ekipe, uključujući i vas.
                        </p>
                      </div>
                      <div className="mb-10">
                        <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                          <svg
                            className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 012 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Šta su merit bodovi?
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                        Merit bodovi služe za ocjenu vjerodostojnosti korisnika. Najviša ocjena je 5 merit bodova, što označava da je korisnik odgovoran, redovan i pouzdan. Ukoliko se korisnik prijavi za termin, a zatim ne dođe, ili pokaže nesportsko ponašanje tokom igre, menadžer ima pravo smanjiti mu merit bodove za jedan. Kada korisnik dosegne samo 1 merit bod, njegov profil će biti ukinut.
                        </p>
                      </div>
                     
                     
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <section class=" dark:bg-gray-900">
            <div class="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Kontaktirajte nas</h2>
                <p class="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
                    Imate li pitanje? Želite prijaviti problem? Javite nam se...
                    <a href= "mailto: sportistadws@gmail.com" className="text-gray-600 hover:border-b hover:border-black"> Klikni ovdje za slanje e-maila! </a></p>
            </div>
          </section>
          <footer className="flex justify-center items-center py-8 ">
            <Link to={"/"} className="hover:cursor-pointer">www.sportsman.com</Link>
        </footer>

        </div>
      );
    };

export default LandingPageComponent;
