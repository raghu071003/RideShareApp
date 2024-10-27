import React, { useEffect, useState } from 'react';
import UpdateRide from './UpdateRide';
import axios from 'axios';

const Dashboard = () => {
    const [showUpdateRide, setShowUpdateRide] = useState(false);
    const [rides, setRides] = useState([]); 
    const [loading, setLoading] = useState(true);

    const handleUpdateClick = () => {
        setShowUpdateRide((prev) => !prev); 
    };


    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.post('http://localhost:8090/api/v1/driver/getRides',{},{withCredentials:true});
                setRides(response.data);
                console.log(response);
                
            } catch (error) {
                console.error("Error fetching rides:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, []);

    return (
        <div className="flex flex-col min-h-screen p-6 bg-gray-100">
            <h2 className="text-3xl font-bold mb-4 text-center">Driver Dashboard</h2>
            <div className="flex-grow">
                {loading ? (
                    <p className="text-center">Loading rides...</p> // Show loading message while fetching
                ) : rides.length > 0 ? (
                    <ul className="mt-4">
                        {rides.map(ride => (
                            <li key={ride.ride_id} className="border p-4 mb-2 rounded shadow bg-white">
                                <h4 className="font-bold">Ride ID: {ride.ride_id}</h4>
                                <p><strong>Source:</strong> {ride.source}</p>
                                <p><strong>Destination:</strong> {ride.destination}</p>
                                <p><strong>Pickup Time:</strong> {ride.pickup_time}</p>
                                <p><strong>Date:</strong> {ride.date}</p>
                                <p><strong>Vehicle Type:</strong> {ride.vehicle_type}</p>
                                <p><strong>Seating Capacity:</strong> {ride.seating_capacity}</p>
                                <p><strong>Status:</strong> {ride.status}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center">No rides found.</p> // Message if no rides are available
                )}
            </div>

            <div className="mt-4 text-center">
                <button 
                    onClick={handleUpdateClick} 
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200 ease-in-out"
                >
                    {showUpdateRide ? 'Hide Update Ride' : 'Update or Add Ride'}
                </button>
                {showUpdateRide && <UpdateRide />}
            </div>
        </div>
    );
};

export default Dashboard;
