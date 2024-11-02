// src/RiderLogin.js

import React, { useEffect, useState } from 'react';
import userlogo from "../assets/User.png"; 
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RiderLogin() {
    const { setLoggedIn, setUser, setRiderId, loggedIn, setRole } = useAuth(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (loggedIn) {
            navigate("/bookride");
        }
    }, [loggedIn, navigate]);

    const login = async (email, password) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post("http://localhost:8090/api/v1/user/login", { email, password }, { withCredentials: true });
            
            if (response.status === 200) {
                setUser(response.data);
                setRole('rider');
                setLoggedIn(true);
                setRiderId(response.data.id); // Store rider ID from response
                navigate('/bookride'); // Redirect to book ride page
            }
        } catch (error) {
            console.error("Login error:", error);
            setError('Invalid email or password.');
            setLoggedIn(false);
            setRiderId(''); // Reset Rider ID on error
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password); // Await login function
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6 lg:p-8 w-full">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl p-10 max-w-sm w-full">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Rider Login
                </h2>
                <img src={userlogo} alt="Rider Icon" className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-blue-600 shadow-md" />
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        required
                    />
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        required
                    />
                    <button
                        type="submit"
                        className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'}`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <p className="mt-4 text-center text-gray-600">
                        <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default RiderLogin;
