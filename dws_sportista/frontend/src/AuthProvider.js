import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct import

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Check local storage for token on mount
        const token = localStorage.getItem('access_token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setIsLoggedIn(true);
            setUserData({ ...decodedToken, token });
        }
    }, []);

    const login = async (formData) => {
        try {
            const response = await fetch("http://localhost:8000/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const user = await response.json();
                const decodedToken = jwtDecode(user.access_token);
                localStorage.setItem('access_token', user.access_token); // Save token in local storage
                setIsLoggedIn(true);
                setUserData({ ...decodedToken, token: user.access_token });
                return true;
            } else {
                console.log("Login failed");
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };
    
    const logout = () => {
        setIsLoggedIn(false);
        setUserData(null);
        localStorage.removeItem('access_token');
    };

    return(
        <AuthContext.Provider value={{ isLoggedIn, userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
