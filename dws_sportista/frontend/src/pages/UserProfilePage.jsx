import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import Footer from "../components/Footer";
import { AuthContext } from "../AuthProvider";

function UserProfilePage() {
  const [userDataState, setUserDataState] = useState(null);
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userData) {
        try {
          const response = await fetch("http://localhost:8000/users/me", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${userData.token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include', 
          });
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setUserDataState(data);
          } else {
            console.log("Failed to fetch user data", response.status);
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      }
    };
    

    fetchUserData();
  }, [userData]);

  if (!userDataState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-gray-600 font-mono bg-orange-300">
      <div className="grid md:grid-cols-3">
        <Navbar />
        <UserCard
          first_name={userDataState.first_name}
          last_name={userDataState.last_name}
          username={userDataState.username}
          email={userDataState.email}
          city={userDataState.city}
          fitness_level={userDataState.fitness_level}
          preferred_sport={userDataState.preferred_sport}
          matches_played={userDataState.matches_played}
          merit={userDataState.merit}
        />
      </div>
      <Footer />
    </div>
  );
}

export default UserProfilePage;
