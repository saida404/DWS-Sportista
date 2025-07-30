import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

function DodajTerenForm() {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    court_type: "",
    court_sport: "",
    image_link: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData)

    const courtData = {
      name: formData.name,
      city: formData.city,
      court_type: formData.court_type,
      sport_type: formData.court_sport,
      image_link: formData.image_link
    };

    try {
      const response = await fetch("http://localhost:8000/courts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courtData),
      });

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="">
      <main className="flex flex-col items-start justify-start flex-1">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6 w-full">
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="name"
              >
                Naziv terena
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Naziv terena"
              />
            </div>

            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="city"
              >
                Lokacija terena
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Lokacija terena"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="court_type"
              >
                Tip terena
              </label>
              <div className="relative">
                <select
                  id="court_type"
                  name="court_type"
                  onChange={handleChange}
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="">Odaberite tip</option>
                  <option value="indoor">Zatvoreni</option>
                  <option value="outdoor">Otvoreni</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="court_sport"
              >
                Sport
              </label>
              <div className="relative">
                <select
                  id="court_sport"
                  name="court_sport"
                  onChange={handleChange}
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="">Odaberite sport</option>
                  <option value="Football">Fudbal</option>
                  <option value="Basketball">Košarka</option>
                  <option value="Tennis">Tenis</option>
                  <option value="Volleyball">Odbojka</option>

                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 mt-8">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="image_link"
              >
                Slika terena (opcionalno)
              </label>
              <input
                type="text"
                id="image_link"
                name="image_link"
                value={formData.image_link}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Link do slike"
              />
            </div>
          </div>
          <div className="md:flex md:items-center mt-3">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <button
                className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default DodajTerenForm;
