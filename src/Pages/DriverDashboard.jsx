import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Car, Users } from 'lucide-react';
import LocationTracker from '../Components/LocationTracker';
import RideRequests from '../Components/rideRequests';


const Dashboard = () => {
    const [showUpdateRide, setShowUpdateRide] = useState(false);
    const [rides, setRides] = useState([]);
    const [rideRequests, setRideRequests] = useState([]);
    const [loadingRides, setLoadingRides] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleUpdateClick = () => {
        setShowUpdateRide(prev => !prev);
        navigate("/driver/updateRide");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestsResponse = await axios.get('http://localhost:8090/api/v1/driver/getRequests', { withCredentials: true })
                setRideRequests(requestsResponse.data.requests);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoadingRequests(false)
            }
            try {
                const ridesResponse = await axios.post('http://localhost:8090/api/v1/driver/getRides', {}, { withCredentials: true })
                setRides(ridesResponse.data);
            } catch (error) {

                console.error("Fetch error:", error);
            } finally {
                setLoadingRides(false);
            }
        };

        fetchData();
    }, []);

    const handleAccept = async (requestId, requiredCapacity, price) => {
        try {
            await axios.post(
                `http://localhost:8090/api/v1/driver/respondToRide`,
                { requestId, response: 'accepted', requiredCapacity, price },
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
            <LocationTracker />
            {/* <NotificationComponent /> */}
            {error && <p className="text-red-500 text-center">{error}</p>}

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

            {/* <RideRequests 
                rideRequests={rideRequests}
                loadingRequests={loadingRequests}
                onAccept={handleAccept}
                onReject={handleReject}
            /> */}

            <div className="mt-10 text-center flex gap-10 justify-center">
                <button
                    onClick={handleUpdateClick}
                    className="bg-blue-700 text-white py-3 px-8 rounded-lg hover:bg-blue-800 transition-all duration-200 shadow-lg transform hover:-translate-y-1"
                >
                    {showUpdateRide ? 'Hide Update Ride' : 'Update or Add Ride'}
                </button>
                <button
                    onClick={() => navigate("/driver/currentRides")}
                    className="bg-blue-700 text-white py-3 px-8 rounded-lg hover:bg-blue-800 transition-all duration-200 shadow-lg transform hover:-translate-y-1"
                >
                    See Your Rides
                </button>
            </div>
        </div>
    );
};

export default Dashboard;