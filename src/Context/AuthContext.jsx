// src/Context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../Components/Loading';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState();
    const [loggedIn, setLoggedIn] = useState(false);
    const [riderId, setRiderId] = useState('');
    const [driverId, setDriverId] = useState('');

    const checkSession = async () => {
        setLoading(true);
        try {
            // Check for rider session
            const riderResponse = await axios.post('http://localhost:8090/api/v1/user/session', {}, { withCredentials: true });
            if (riderResponse.status === 200) {
                setUser(riderResponse.data);
                setLoggedIn(true);
                setRole('rider');
                setRiderId(riderResponse.data.id);
                console.log("Rider session:", riderResponse);
                return;
            }
        } catch (error) {
            console.error('Rider session validation error:', error);
            setLoggedIn(false);
            setRiderId('');
        }finally{
            setLoading(false)
        }

        try {
            // Check for driver session
            const driverResponse = await axios.post('http://localhost:8090/api/v1/driver/session', {}, { withCredentials: true });
            if (driverResponse.status === 200) {
                setUser(driverResponse.data);
                setLoggedIn(true);
                setRole('driver');
                setDriverId(driverResponse.data.id);
                console.log("Driver session:", driverResponse);
                return;
            }
        } catch (error) {
            console.error('Driver session validation error:', error);
            setLoggedIn(false);
            setDriverId('');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, setLoggedIn, loggedIn, setRole, role, riderId, setRiderId, driverId, setDriverId }}>
            {loading ? <Loading /> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
