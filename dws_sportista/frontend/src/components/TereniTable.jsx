import React, { useState, useEffect } from 'react';

const TereniTable = () => {
  const [tereni, setTereni] = useState([]);

  const fetchTereni = async () => {
    try {
      const response = await fetch("http://localhost:8000/courts/table");
      if (response.ok) {
        const data = await response.json();
       setTereni(data); 
      } else {
        console.error("Failed to fetch basketball appointments");
        return []; 
      }
    } catch (error) {
      console.error("Error fetching basketball appointments:", error);
      return []; 
    }
  }

  const handleRemove = async (id) => {
    setTereni(tereni.filter(teren => teren.id !== id));
  };

  
  useEffect(() => {
    fetchTereni();
  }, []);
  

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">ID terena</th>
            <th className="px-4 py-2">Naziv terena</th>
            <th className="px-4 py-2">Ime vlasnika</th>
            <th className="px-4 py-2">Prezime vlasnika</th>
            <th className="px-4 py-2">Tip terena</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {tereni.map(teren => (
            <tr key={teren.id}>
                <td className="border px-4 py-2">{teren.id}</td>
              <td className="border px-4 py-2">{teren.name}</td>
              <td className="border px-4 py-2">{teren.owner_first_name}</td>
              <td className="border px-4 py-2">{teren.owner_last_name}</td>
              <td className="border px-4 py-2">{teren.court_type}</td>
              <td className="border px-4 py-2">
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TereniTable;
