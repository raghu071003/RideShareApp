import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { loggedIn, role, setLoggedIn,setRole } = useAuth(); // Assuming `role` indicates 'rider' or 'driver'
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            if (role === 'driver') {
                const res = await axios.post("http://localhost:8090/api/v1/driver/logout", {}, { withCredentials: true });
                if(res.status === 200){
                    document.cookie = "Driver_accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "Driver_refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    navigate('/');
                    setLoggedIn(false);
                    setRole('')
                }
                
            } else if(role === 'rider') {
                 const res = await axios.post("http://localhost:8090/api/v1/user/logout", {}, { withCredentials: true });
                 if(res.status === 200){
                    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    navigate('/');
                    setLoggedIn(false);
                    setRole('')
                 }
            } else{
                const res = await axios.post("http://localhost:8090/api/v1/admin/logout",{},{withCredentials:true});
                if(res.status === 200){
                    navigate('/')
                    setLoggedIn(false);
                    setRole('')
                }
            }
            
            
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div className="text-2xl font-bold text-blue-600 hover:cursor-pointer" onClick={() => navigate("/")}>RideShare</div>
                <div className="hidden md:flex space-x-6">
                    <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
                    <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
                    <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
                    <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
                </div>
                <div className="hidden md:flex">
                    {loggedIn ? (
                        <button onClick={handleLogout} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                            Logout
                        </button>
                    ) : (
                        <>
                            <a href="/rider-login" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mr-2">
                                Rider Login
                            </a>
                            <a href="/driver-login" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                Driver Login
                            </a>
                        </>
                    )}
                </div>
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden">
                    <div className="flex flex-col items-center space-y-4 py-4">
                        <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
                        <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
                        <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
                        <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
                        {isLoggedin ? (
                            <button onClick={handleLogout} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                Logout
                            </button>
                        ) : (
                            <>
                                <a href="/rider-login" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mr-2">
                                    Rider Login
                                </a>
                                <a href="/driver-login" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                    Driver Login
                                </a>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
