// src/RiderLogin.js

import React, { useEffect, useState } from 'react';
import userlogo from "../assets/User.png"; 
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RiderLogin() {
    const { setLoggedIn, setUser, setRiderId,loggedIn } = useAuth(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(()=>{
        if(loggedIn){
            navigate("/bookride")
        }
    })
    const login = async (email, password) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post("http://localhost:8090/api/v1/user/login", { email, password }, { withCredentials: true });
            
            if (response.status === 200) {
                setUser(response.data);
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-blue-400 w-full">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Rider Login</h2>
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
                        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                        required
                    />
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                        required
                    />
                    <button
                        type="submit"
                        className={`bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
