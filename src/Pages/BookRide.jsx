// src/components/UpdateRider.js

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const UpdateRider = () => {
    const {riderId} = useAuth();
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        // console.log(riderId);
        
        try {
            const response = await axios.post('http://localhost:8090/api/v1/user/update', {
                riderId,
                source,
                destination,
                pickupTime,
                pickupDate,
            });

            if (response.data.success) {
                setMessage('Ride details updated successfully!');
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error('Error updating rider details:', error);
            setMessage('An error occurred while updating ride details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-blue-400 w-full">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Request Ride</h2>
                {message && <p className="text-center text-red-500 mb-4">{message}</p>}
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Source"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                        required
                    />
                    <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                        required
                    />
                    <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                        required
                    />
                    <button
                        type="submit"
                        className={`bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Request Ride'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateRider;
