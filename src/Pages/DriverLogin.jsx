import React from 'react';

function DriverLogin() {
    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-r from-green-600 to-green-400">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Driver Login</h2>
                <img 
                    src="https://cdn0.iconfinder.com/data/icons/transportation-138/50/93-1024.png" 
                    alt="Driver Icon" 
                    className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-green-600 shadow-md" 
                />
                
                <form className="flex flex-col">
                    <input
                        type="email"
                        placeholder="Email"
                        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200 ease-in-out"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200 ease-in-out"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-200 ease-in-out shadow-md"
                    >
                        Login
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
