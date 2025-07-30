import React, { useEffect, useState } from 'react';

const TerminiTable = ({ token }) => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost:8000/reservations/user", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched reservations:", data);
          setReservations(data);
        } else {
          console.error('Failed to fetch reservations');
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, [token]);

  const handleRemove = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setReservations((prevReservations) => prevReservations.filter((reservation) => reservation.reservation_id !== id));
      } else {
        console.error('Failed to delete the reservation');
      }
    } catch (error) {
      console.error('Error deleting the reservation:', error);
    }
  };

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

  const getSportName = (sportId) => {
    switch (sportId) {
      case "1":
        return 'Football';
      case "2":
        return 'Basketball';
      case "3":
        return 'Volleyball';
      case "4":
        return 'Tennis';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Reservation ID</th>
            <th className="px-4 py-2">Početak</th>
            <th className="px-4 py-2">Kraj</th>
            <th className="px-4 py-2">Sport</th>
            <th className="px-4 py-2">Court</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.reservation_id}>
              <td className="border px-4 py-2">{reservation.reservation_id}</td>
              <td className="border px-4 py-2">{formatDate(reservation.start_time)}</td>
              <td className="border px-4 py-2">{formatDate(reservation.end_time)}</td>
              <td className="border px-4 py-2">{getSportName(reservation.sport)}</td>
              <td className="border px-4 py-2">{reservation.court_name}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleRemove(reservation.reservation_id)}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TerminiTable;
