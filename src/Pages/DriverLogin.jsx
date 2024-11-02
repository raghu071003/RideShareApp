// src/DriverLogin.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

function DriverLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { setLoggedIn, setRole, loggedIn } = useAuth();

    useEffect(() => {
        if (loggedIn) {
            navigate("/driver/dashboard");
        }
    }, [loggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:8090/api/v1/driver/login', {
                email,
                password,
            }, { withCredentials: true });

            if (response.status === 200) {
                setLoggedIn(true);
                setRole('driver');
                navigate("/driver/dashboard");
            } else {
                setErrorMessage(response.data.message || "Login failed. Please try again.");
                setLoggedIn(false);
            }
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("An error occurred while trying to log in.");
            setLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 lg:p-8 w-full">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl p-10 max-w-md w-full">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    Driver Login
                </h2>
                <img 
                    src="https://cdn0.iconfinder.com/data/icons/transportation-138/50/93-1024.png" 
                    alt="Driver Icon" 
                    className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-green-600 shadow-md" 
                />
                
                {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                        required
                    />
                    <button
                        type="submit"
                        className={`w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-medium shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'}`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <p className="mt-4 text-center text-gray-600">
                        <a href="#" className="text-green-600 hover:underline">Forgot Password?</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default DriverLogin;
