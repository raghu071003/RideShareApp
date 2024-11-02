import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { loggedIn, role, setLoggedIn, setRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            let res;
            if (role === 'driver') {
                res = await axios.post("http://localhost:8090/api/v1/driver/logout", {}, { withCredentials: true });
            } else if (role === 'rider') {
                res = await axios.post("http://localhost:8090/api/v1/user/logout", {}, { withCredentials: true });
            } else {
                res = await axios.post("http://localhost:8090/api/v1/admin/logout", {}, { withCredentials: true });
            }

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
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div className="leading-[0] flex flex-col items-center cursor-pointer" onClick={() => navigate("/")}>
                    <p className='text-2xl font-bold text-blue-600'>RideShare</p>
                    <p className='sub-font font-bold text-blue-600 md:ml-2'>Hexaware</p>
                </div>
                <div className="hidden md:flex space-x-6">
                    <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
                    <Link to="/rider/features" className="text-gray-600 hover:text-blue-600">Features</Link>
                    <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
                    <Link to="#contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
                </div>
                <div className="hidden md:flex">
                    {loggedIn ? (
                        <button onClick={handleLogout} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/rider-login" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mr-2">
                                Rider Login
                            </Link>
                            <Link to="/driver-login" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                Driver Login
                            </Link>
                        </>
                    )}
                </div>
                <div className="md:hidden flex items-center">
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        aria-expanded={isOpen} 
                        className="text-gray-600 focus:outline-none transition duration-200 ease-in-out"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden transition duration-300 ease-in-out">
                    <div className="flex flex-col items-center space-y-4 py-4">
                        <Link to="/" className="text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link to="/rider/features" className="text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>Features</Link>
                        <Link to="/about" className="text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>About</Link>
                        <Link to="#contact" className="text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>Contact</Link>
                        {loggedIn ? (
                            <button onClick={handleLogout} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/rider-login" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mr-2" onClick={() => setIsOpen(false)}>
                                    Rider Login
                                </Link>
                                <Link to="/driver-login" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700" onClick={() => setIsOpen(false)}>
                                    Driver Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
