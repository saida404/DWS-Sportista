import React, { useState, useEffect } from 'react';
import { AuthContext } from "../AuthProvider";
const KorisniciTable = () => {
  const [korisnici, setKorisnici] = useState([]);

  const fetchKorisnici = async () => {
    try {
      const response = await fetch("http://localhost:8000/users-all");
      if (response.ok) {
        const data = await response.json();
       setKorisnici(data); 
      } else {
        console.error("Failed to fetch all users");
        return []; 
      }
    } catch (error) {
      console.error("Error: NO USERS FOUND", error);
      return []; 
    }
  }

  const increaseMerit = async (userId) => {
    userId = parseInt(userId); 
    const response = await fetch(`http://localhost:8000/usersIM/${userId}/increase_merit`, {
      method: 'PUT'
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setKorisnici(prevState =>
        prevState.map(korisnik =>
          korisnik.id === userId ? { ...korisnik, merit: updatedUser.merit } : korisnik
        )
      );
    } else {
      console.error("Failed to increase merit");
    }
  };

  
  const decreaseMerit = async (userId) => {
    userId = parseInt(userId); 
    const response = await fetch(`http://localhost:8000/usersDM/${userId}/decrease_merit`, {
      method: 'PUT'
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setKorisnici(prevState =>
        prevState.map(korisnik =>
          korisnik.id === userId ? { ...korisnik, merit: updatedUser.merit } : korisnik
        )
      );
    } else {
        console.log(userId)
      console.error("Failed to decrease merit");
    }
  };


  const deleteUser = async (userId) => {
    userId = parseInt(userId); 
    const response = await fetch(`http://localhost:8000/users/${userId}`, {
      method: 'DELETE'
    });
  
    if (response.ok) {
      // Ako je brisanje uspješno, ažurirajte stanje korisnika tako da uklonite izbrisani element iz liste korisnika
      setKorisnici(prevState =>
        prevState.filter(korisnik => korisnik.id !== userId)
      );
      console.log(`User with ID ${userId} successfully deleted.`);
    } else {
      console.error("Failed to delete user");
    }
  };
  


  
  useEffect(() => {
    fetchKorisnici();
  }, []);
  

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Ime</th>
            <th className="px-4 py-2">Prezime</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Merit</th>
             <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {korisnici.map(korisnik => (
            <tr key={korisnik.id}>
              <td className="border px-4 py-2">{korisnik.username}</td>
              <td className="border px-4 py-2">{korisnik.first_name}</td>
              <td className="border px-4 py-2">{korisnik.last_name}</td>
              <td className="border px-4 py-2">{korisnik.email}</td>
              <td className="border px-4 py-2">{korisnik.merit}</td>
              <td className="border px-4 py-2">
                  <button 
                        onClick={() => increaseMerit(korisnik.id)}
                        className={`border ${korisnik.merit === 5 ? 'border-gray-400 text-gray-400 cursor-not-allowed' : 'border-green-600 text-green-600'} rounded p-2 mr-2 hover:shadow-md`}>
                          +
                  </button>
                  {korisnik.merit === 1 ? (
                      <button
                        onClick={() => deleteUser(korisnik.id)}
                        className=" border-red-600 text-red-600 border md:border-2 rounded p-2 mr-2 hover:shadow-md"
                      >
                        x
                      </button>
                    ) : (
                      <button
                        onClick={() => decreaseMerit(korisnik.id)}
                        className="border-red-600 text-red-600 border md:border-2 rounded p-2 mr-2 hover:shadow-md"
                      >
                        -
                      </button>
                    )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KorisniciTable;
