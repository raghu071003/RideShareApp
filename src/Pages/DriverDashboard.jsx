// src/Dashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Car, User, CheckCircle, XCircle, Users, IndianRupee } from 'lucide-react'; // Importing Lucide icons

const Dashboard = () => {
    const [showUpdateRide, setShowUpdateRide] = useState(false);
    const [rides, setRides] = useState([]);
    const [rideRequests, setRideRequests] = useState([]);
    const [loadingRides, setLoadingRides] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleUpdateClick = () => {
        setShowUpdateRide(prev => !prev); // Toggle showUpdateRide
        navigate("/driver/updateRide");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ridesResponse, requestsResponse] = await Promise.all([
                    axios.post('http://localhost:8090/api/v1/driver/getRides', {}, { withCredentials: true }),
                    axios.get('http://localhost:8090/api/v1/driver/getRequests', { withCredentials: true })
                ]);
                setRides(ridesResponse.data);
                setRideRequests(requestsResponse.data.requests);
            } catch (error) {
                setError("Error fetching data. Please try again later.");
                console.error("Fetch error:", error);
            } finally {
                setLoadingRides(false);
                setLoadingRequests(false);
            }
        };

        fetchData();
        console.log(rideRequests);
        
    }, []);

    const handleAccept = async (requestId, requiredCapacity) => {
        try {
            await axios.post(
                `http://localhost:8090/api/v1/driver/respondToRide`,
                { requestId, response: 'accepted', requiredCapacity },
                { withCredentials: true }
            );
            setRideRequests(rideRequests.filter(request => request.id !== requestId));
            console.log("Ride request accepted.");
        } catch (error) {
            console.error("Error accepting ride request:", error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.post(
                `http://localhost:8090/api/v1/driver/respondToRide`,
                { requestId, response: 'rejected' },
                { withCredentials: true }
            );
            setRideRequests(rideRequests.filter(request => request.id !== requestId));
            console.log("Ride request rejected.");
        } catch (error) {
            console.error("Error rejecting ride request:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen p-8 bg-gradient-to-b from-blue-50 to-blue-100 w-full">
            <h2 className="text-4xl font-bold mb-8 text-center text-blue-800">Driver Dashboard</h2>

            {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error message */}

            <div className="flex-grow mb-10">
                {loadingRides ? (
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
                                    <p><strong><Clock className="inline mr-1" /> Date:</strong> {new Date(ride.date).toLocaleDateString()}</p>
                                    <p><strong><Car className="inline mr-1" /> Vehicle Type:</strong> {ride.vehicle_type}</p>
                                    <p><strong><Users className='inline mr-1' /> Seating Capacity:</strong> {ride.seating_capacity}</p>
                                    <p className="text-sm text-gray-600"><strong>Status:</strong> {ride.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No rides found.</p>
                )}
            </div>

            <div className="mt-10">
                <h3 className="text-3xl font-bold mb-6 text-center text-blue-700">Ride Requests</h3>
                {loadingRequests ? (
                    <p className="text-center text-blue-600 text-lg">Loading ride requests...</p>
                ) : rideRequests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rideRequests.map(request => (
                            <div key={request.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-6 transition-transform transform hover:-translate-y-2 hover:shadow-lg">
                                <h4 className="text-xl font-semibold mb-3 text-blue-700">
                                    <User className="inline mr-2" /> Request ID: {request.id}
                                </h4>
                                <div className="space-y-2 text-gray-700">
                                    <p><strong><User className="inline mr-1" /> Rider ID:</strong> {request.rider_id}</p>
                                    <p><strong><MapPin className="inline mr-1" /> Source:</strong> {request.source}</p>
                                    <p><strong><MapPin className="inline mr-1" /> Destination:</strong> {request.destination}</p>
                                    <p><strong><Clock className="inline mr-1" /> Pickup Time:</strong> {request.pickup_time}</p>
                                    <p><strong><Clock className="inline mr-1" /> Date:</strong> {new Date(request.pickup_date).toLocaleDateString()}</p>
                                    <p><strong><Users className="inline mr-1" /> Seating:</strong> {request.seating_required}</p>
                                    <p><strong><IndianRupee className="inline mr-1" /> Price:</strong> {request.price}</p>
                                </div>
                                <div className="flex justify-between mt-6 space-x-2">
                                    <button
                                        onClick={() => handleAccept(request.id, request.seating_required)}
                                        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center"
                                    >
                                        <CheckCircle className="mr-1" /> Accept
                                    </button>
                                    <button
                                        onClick={() => handleReject(request.id)}
                                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center"
                                    >
                                        <XCircle className="mr-1" /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No ride requests found.</p>
                )}
            </div>

            <div className="mt-10 text-center">
                <button
                    onClick={handleUpdateClick}
                    className="bg-blue-700 text-white py-3 px-8 rounded-lg hover:bg-blue-800 transition-all duration-200 shadow-lg transform hover:-translate-y-1"
                >
                    {showUpdateRide ? 'Hide Update Ride' : 'Update or Add Ride'}
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
