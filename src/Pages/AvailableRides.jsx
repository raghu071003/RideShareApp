import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const AvailableRides = () => {
    const { riderId } = useAuth(); // Assuming you have user context
    const [rides, setRides] = useState([]);
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        try {
            const response = await axios.get('http://localhost:8090/api/v1/rides/available', {
                params: { source, destination },
                withCredentials: true
            });

            if (response.data.success) {
                setRides(response.data.rides);
            } else {
                setMessage(response.data.message);
                setRides([]);
            }
        } catch (error) {
            console.error('Error fetching available rides:', error);
            setMessage('An error occurred while fetching available rides.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-blue-400 w-full">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Available Rides</h2>
                <form className="flex flex-col mb-4" onSubmit={handleSearch}>
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
                    <button
                        type="submit"
                        className={`bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Find Rides'}
                    </button>
                </form>
                {message && <p className="text-center text-red-500">{message}</p>}
                {rides.length > 0 ? (
                    <ul className="mt-4">
                        {rides.map((ride) => (
                            <li key={ride.ride_id} className="border-b py-2">
                                <div>
                                    <strong>Driver:</strong> {ride.driver_name}
                                </div>
                                <div>
                                    <strong>Source:</strong> {ride.source}
                                </div>
                                <div>
                                    <strong>Destination:</strong> {ride.destination}
                                </div>
                                <div>
                                    <strong>Status:</strong> {ride.status}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center">No available rides found.</p>
                )}
            </div>
        </div>
    );
};

export default AvailableRides;
