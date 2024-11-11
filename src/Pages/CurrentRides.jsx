// src/CurrentRides.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Car, Users, CheckCircle, Check } from 'lucide-react';

const CurrentRides = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get('http://localhost:8090/api/v1/driver/currentRides', { withCredentials: true });
                setRides(response.data.requests);
            } catch (error) {
                // setError("Error fetching current rides. Please try again later.");
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, []);

    const handleCompleteRide = async (rideId) => {
        try {
            await axios.post(`http://localhost:8090/api/v1/driver/completeRide`, {rideId :rideId}, { withCredentials: true });
            setRides((prevRides) => prevRides.filter(ride => ride.ride_id !== rideId));
            alert(`Ride ID: ${rideId} marked as completed.`);
        } catch (error) {
            console.error("Error completing ride:", error);
            alert("Failed to mark ride as completed. Please try again.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen p-8 bg-gradient-to-b from-blue-50 to-blue-100 w-full">
            <h2 className="text-4xl font-bold mb-8 text-center text-blue-800">Current Rides</h2>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {loading ? (
                <p className="text-center text-blue-600 text-lg">Loading rides...</p>
            ) : rides.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rides.map(ride => (
                        <div key={ride.ride_id} className="bg-white border border-gray-200 rounded-lg shadow-md p-6 transition-transform transform hover:-translate-y-2 hover:shadow-lg">
                            <h4 className="text-2xl font-semibold mb-4 text-blue-700">
                                <MapPin className="inline mr-2" /> Ride ID: {ride.ride_id}
                            </h4>
                            <div className="space-y-2 text-gray-700">
                                <p><strong><MapPin className="inline mr-1" /> Source:</strong> {ride.source}</p>
                                <p><strong><MapPin className="inline mr-1" /> Destination:</strong> {ride.destination}</p>
                                <p><strong><Clock className="inline mr-1" /> Pickup Time:</strong> {ride.pickup_time}</p>
                                <p><strong><Clock className="inline mr-1" /> Date:</strong> {new Date(ride.pickup_date).toLocaleDateString()}</p>
                                <p><strong><Car className="inline mr-1" /> Vehicle Type:</strong> {ride.vehicle_type}</p>
                                <p><strong><Users className="inline mr-1" /> Seating Capacity:</strong> {ride.seating_capacity}</p>
                                <p className="text-sm text-gray-600"><strong>Status:</strong> {ride.status}</p>
                            </div>
                            <p className='text-red-500'>Please mark as Complete only if you recieve the payment</p>
                            <button
                                onClick={() => handleCompleteRide(ride.ride_id)}
                                className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center"
                            >
                                <Check className="mr-1" /> Ride Completed
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">No current rides found.</p>
            )}
        </div>
    );
};

export default CurrentRides;
