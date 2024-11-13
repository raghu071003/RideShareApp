import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';

function NavbarDriver() {
    const [isOpen, setIsOpen] = useState(false);
    const { loggedIn, role, setLoggedIn, setRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            
            const res = await axios.post("http://localhost:8090/api/v1/driver/logout", {}, { withCredentials: true });
            if (res && res.status === 200) {
                document.cookie = `${role === 'driver' ? 'Driver' : ''}accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                document.cookie = `${role === 'driver' ? 'Driver' : ''}refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                navigate('/');
                setLoggedIn(false);
                setRole('');
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <nav className="bg-gray-800 shadow-md border-b border-gray-700 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/" className="text-blue-600 font-bold ">
                    <div className="leading-[0] flex flex-col items-center cursor-pointer" onClick={() => navigate("/")}>
                            <p className='text-2xl font-bold text-blue-600'>RideShare</p>
                            {/* <p className='sub-font font-bold text-blue-600 md:ml-2'>Hexaware</p> */}
                            <img src="https://hexaware.com/wp-content/themes/hexaware/assets/images/logo.svg" alt="" className='w-20'/>
                        </div>
                    </Link>
                </div>
                <div className="hidden md:flex space-x-6">
                    <Link to="/" className="text-gray-200 font-medium hover:text-blue-600 transition-colors duration-200">
                        Home
                    </Link>
                    <Link to="/driver/dashboard" className="text-gray-200 font-medium hover:text-blue-600 transition-colors duration-200">
                        Your Rides
                    </Link>
                    <Link to="/driver/rideRequests" className="text-gray-200 font-medium hover:text-blue-600 transition-colors duration-200">
                        Ride Requests
                    </Link>
                    <Link to="/contact" className="text-gray-200 font-medium hover:text-blue-600 transition-colors duration-200">
                        Contact
                    </Link>
                </div>
                <div className="hidden md:flex items-center">
                    {loggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="space-x-2">
                            <Link
                                to="/rider-login"
                                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                            >
                                Rider Login
                            </Link>
                            <Link
                                to="/driver-login"
                                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                            >
                                Driver Login
                            </Link>
                        </div>
                    )}
                </div>
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        className="text-gray-200 focus:outline-none transition-colors duration-200 hover:text-blue-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden transition-all duration-300 ease-in-out">
                    <div className="flex flex-col items-center space-y-4 py-4 border-t border-gray-200">
                        <Link
                            to="/"
                            className="text-gray-200 font-medium hover:text-blue-600 transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/driver/dashboard"
                            className="text-gray-200 font-medium hover:text-blue-600 transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            Your Rides
                        </Link>
                        <Link
                            to="/driver/rideRequests"
                            className="text-gray-200 font-medium hover:text-blue-600 transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            Ride Requests
                        </Link>
                        <Link
                            to="/contact"
                            className="text-gray-200 font-medium hover:text-blue-600 transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            Contact
                        </Link>
                        {loggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                            >
                                Logout
                            </button>
                        ) : (
                            <div className="space-x-2">
                                <Link
                                    to="/rider-login"
                                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Rider Login
                                </Link>
                                <Link
                                    to="/driver-login"
                                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Driver Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavbarDriver;
