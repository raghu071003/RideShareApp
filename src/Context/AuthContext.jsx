// src/Context/AuthContext.js

import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loggedIn, setLoggedIn] = useState(false); // Add loggedIn state
    const [riderId,setRiderId] = useState('');



    const logout = () => {
        setUser(null);
        setLoggedIn(false); // Reset loggedIn state on logout
    };

    return (
        <AuthContext.Provider value={{ setLoggedIn,setUser,riderId,setRiderId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
