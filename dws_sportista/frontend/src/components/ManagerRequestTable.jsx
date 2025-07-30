import React, { useState, useEffect } from 'react';

const ManagerRequestTable = () => {
  const [userFields, setUserFields] = useState([]);


  useEffect(() => {
    const fetchUserFields = async () => {
      try {
        const response = await fetch('http://localhost:8000/manager-applications');
        if (response.ok) {
          const data = await response.json();
          setUserFields(data);
        } else {
          console.error('Failed to fetch user fields');
        }
      } catch (error) {
        console.error('Error fetching user fields:', error);
      }
    };

    fetchUserFields();
  }, []);

  const handleApprove = async (id) => {
    console.log(`Clicked approve for user ID ${id}`);
    try {
      const response = await fetch(`http://localhost:8000/manager-applications/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        // Update userFields to reflect the change (optional)
        const updatedUserFields = userFields.map(user => {
          if (user.user_id === id) {
            return { ...user, role: 'manager' };
          }
          return user;
        });
        setUserFields(updatedUserFields);
      } else {
        console.error('Failed to approve application');
      }
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/manager-applications/${id}/reject`, {
        method: 'DELETE',  // Use DELETE method to delete the request
      });

      if (response.ok) {
        console.log(`Clicked Reject for user ID ${id}`);
        // Optional: Remove the rejected request from userFields
        const updatedUserFields = userFields.filter(user => user.user_id !== id);
        setUserFields(updatedUserFields);
      } else {
        console.error('Failed to reject application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

//funkcija za formatiranje datuma
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">ID korisnika</th>
            <th className="px-4 py-2">Ime</th>
            <th className="px-4 py-2">Prezime</th>
            <th className="px-4 py-2">Datum prijave</th>
            <th className="px-4 py-2">Razlog</th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>

          </tr>
        </thead>
        <tbody>
          {userFields.map(userField => (
             <tr key={userField.user_id}>
             <td className="border px-4 py-2">{userField.user_id}</td>
             <td className="border px-4 py-2">{userField.first_name}</td>
             <td className="border px-4 py-2">{userField.last_name}</td>
             <td className="border px-4 py-2">{formatDate(userField.request_date)}</td>
             <td className="border px-4 py-2">{userField.reason}</td>
             <td className="border px-4 py-2">
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => handleApprove(userField.user_id)}
                >
                  Prihvati
                </button>
              </td>
              <td className="border px-4 py-2">
              <button 
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleReject(userField.user_id)}
                >
                  Odbij
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerRequestTable;
