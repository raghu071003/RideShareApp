import React, { useState } from 'react';
import axios from 'axios';

function AdminLogin() {
    const [email, setEmail] = useState(''); // State for email
    const [password, setPassword] = useState(''); // State for password
    const [error, setError] = useState(''); // State for error messages
    const [loading, setLoading] = useState(false); // State for loading indicator

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true); 
        setError('');
        try {
            const response = await axios.put("http://localhost:8090/api/v1/user/login", {
                email,
                password,
            });
            console.log(response.data);
            // Handle successful login (e.g., redirect or update context)
        } catch (error) {
            console.error("Login error:", error);
            setError('Invalid email or password.'); // Set error message
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 mx-auto mt-20">
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
            <img src="admin-icon.png" alt="Admin Icon" className="w-20 h-20 mx-auto mb-4" />
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email} // Controlled input
                    onChange={(e) => setEmail(e.target.value)} // Update state
                    className="mb-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required // Make this field required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password} // Controlled input
                    onChange={(e) => setPassword(e.target.value)} // Update state
                    className="mb-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required // Make this field required
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>} {/* Error message */}
                <button
                    type="submit"
                    className={`bg-red-500 text-white py-2 rounded-md hover:bg-red-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading} // Disable button when loading
                >
                    {loading ? 'Logging in...' : 'Login'} {/* Change button text during loading */}
                </button>
            </form>
        </div>
    );
}

export default AdminLogin;
