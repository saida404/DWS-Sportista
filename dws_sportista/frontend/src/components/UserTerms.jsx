import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const UserTerms = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:8000/reservations/user"); 
      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:8000/reservations/cancel/${reservationId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to cancel reservation");
      }
      setReservations(reservations.filter(reservation => reservation.id !== reservationId));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="text-gray-600 font-mono">
      <div className="grid md:grid-cols-3">
        <div className="md:col-span-2 p-4">
          <h2 className="text-2xl font-semibold mb-4">Your Reservations</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <ul>
            {reservations.map((reservation) => (
              <li key={reservation.id} className="flex justify-between items-center mb-2 p-2 border rounded">
                <div>
                  <p><strong>Start Time:</strong> {reservation.start_time}</p>
                  <p><strong>End Time:</strong> {reservation.end_time}</p>
                  <p><strong>Sport:</strong> {reservation.sport_id}</p>
                  <p><strong>Court:</strong> {reservation.court_id}</p>
                  <p><strong>Players:</strong> {reservation.number_of_players}</p>
                </div>
                <button
                  onClick={() => handleCancel(reservation.id)}
                  className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserTerms;
