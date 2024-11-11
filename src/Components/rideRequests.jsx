import React, { useEffect, useState } from 'react';
import { MapPin, Clock, User, CheckCircle, XCircle, Users, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RideRequests = () => {
    const [rideRequests, setRideRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                                    onClick={() => handleAccept(request.id, request.seating_required, request.price)}
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
    );
};

export default RideRequests;