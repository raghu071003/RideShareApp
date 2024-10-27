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
    const {setLoggedIn,setRole,loggedIn} = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true); 
        setError(''); // Clear any previous error messages
        try {
            const response = await axios.post("http://localhost:8090/api/v1/admin/login", {
                username, // Use username instead of email
                password,
            },{withCredentials:true});
            if(response.status === 200){
                setLoggedIn(true)
                setRole('admin')
                navigate("/admin/dashboard")
            }
        } catch (error) {
            console.error("Login error:", error);
            setError('Invalid username or password.'); // Set error message
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 mx-auto mt-20">
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
            <img src="https://www.pngmart.com/files/21/Administrator-PNG-File.png" alt="Admin Icon" className="w-20 h-20 mx-auto mb-4" />
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <input
                    type="text" // Change type to text for username
                    placeholder="Username" // Update placeholder text
                    value={username} // Controlled input
                    onChange={(e) => setUsername(e.target.value)} // Update state
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
