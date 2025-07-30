import React, { useState, useEffect } from "react";

function DodajTerminForm() {
  const [formData, setFormData] = useState({
    start_time: "",
    end_time: "",
    court_name: "", // Changed from court_name to court_id
    sport: "",
    available_slots: "",
  });

  const [courts, setCourts] = useState([]); // State to hold the list of courts

  useEffect(() => {
    // Fetch list of courts when component mounts
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await fetch("http://localhost:8000/courts/all");
      if (response.ok) {
        const data = await response.json();
        setCourts(data);
      } else {
        console.error("Failed to fetch courts");
      }
    } catch (error) {
      console.error("Error fetching courts:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courtData = {
      start_time: formData.start_time,
      end_time: formData.end_time,
      court_name: formData.court_name, // Changed from court_name to court_name
      sport: formData.sport,
      available_slots: formData.available_slots,
    };

    try {
      const response = await fetch("http://localhost:8000/appointments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courtData),
      });

      if (!response.ok) {
        alert("Greška prilikom dodavanja termina! Provjerite unesene podatke!");
      }
    } catch (error) {
      alert("Greška prilikom dodavanja termina! Provjerite unesene podatke!");
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
                htmlFor="start_time"
              >
                Početak termina
              </label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="end_time"
              >
                Kraj termina
              </label>
              <input
                type="datetime-local"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="court_name" // Changed from court_name to court_name
              >
                Naziv dvorane
              </label>
              <select
                id="court_name" // Changed from court_name to court_name
                name="court_name" // Changed from court_name to court_name
                value={formData.court_name} // Changed from court_name to court_name
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value="">Odaberite dvoranu</option>
                {courts.map((court) => (
                  <option key={court.id} value={court.name}>
                    {court.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="sport"
              >
                Sport
              </label>
              <input
                type="text"
                id="sport"
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Sport"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="available_slots"
              >
                Dostupni slotovi
              </label>
              <input
                type="number"
                id="available_slots"
                name="available_slots"
                min="0"
                value={formData.available_slots}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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

export default DodajTerminForm;

