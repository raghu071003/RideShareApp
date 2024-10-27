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
    const {setLoggedIn,setRole,loggedIn} = useAuth();

    useEffect(()=>{
        if(loggedIn){
            navigate("/driver/dashboard")
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:8090/api/v1/driver/login', {
                email,
                password,
            },{withCredentials:true});
            // console.log(response);
            
            if (response.status === 200) {
                setLoggedIn(true)
                setRole('driver')
                navigate("/driver/dashboard")
                
            } else {
                setErrorMessage(response.data.message || "Login failed. Please try again.");
                setLoggedIn(false)
            }
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("An error occurred while trying to log in.");
            setLoggedIn(false)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-r from-green-600 to-green-400">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Driver Login</h2>
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
                        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200 ease-in-out"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200 ease-in-out"
                        required
                    />
                    <button
                        type="submit"
                        className={`bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-200 ease-in-out shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
