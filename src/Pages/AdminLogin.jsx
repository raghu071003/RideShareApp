import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

function AdminLogin() {
    const [username, setUsername] = useState(''); // State for username
    const [password, setPassword] = useState(''); // State for password
    const [error, setError] = useState(''); // State for error messages
    const [loading, setLoading] = useState(false); // State for loading indicator
    const navigate = useNavigate();
    const { setLoggedIn, setRole } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(''); // Clear any previous error messages
        try {
            const response = await axios.post("http://localhost:8090/api/v1/admin/login", {
                username,
                password,
            }, { withCredentials: true });
            if (response.status === 200) {
                setLoggedIn(true);
                setRole('admin');
                navigate("/admin/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError('Invalid username or password.'); // Set error message
            setLoggedIn(false)

        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 min-h-screen flex items-center justify-center w-full">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Admin Login</h2>
                <img src="https://www.pngmart.com/files/21/Administrator-PNG-File.png" alt="Admin Icon" className="w-20 h-20 mx-auto mb-4" />
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <div className="relative mb-3">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="pl-9 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out w-full"
                            required
                        />
                        <span className="absolute left-3 top-3 text-gray-400">👤</span> {/* Username Icon */}
                    </div>
                    <div className="relative mb-3">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-9 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out w-full"
                            required
                        />
                        <span className="absolute left-3 top-3 text-gray-400">🔒</span> {/* Password Icon */}
                    </div>
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <button
                        type="submit"
                        className={`bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
