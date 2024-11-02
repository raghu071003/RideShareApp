import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { Loader2, MapPin, Clock, Calendar, Car, Users, ArrowRight, Navigation } from 'lucide-react';
import axios from 'axios';

const UpdateRider = () => {
    const { riderId } = useAuth();
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        pickupTime: '',
        pickupDate: '',
    });
    const [rideDetails, setRideDetails] = useState(null);
    const [selectedCapacity, setSelectedCapacity] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rideavailable,setridAvailable] = useState(false)
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setIsSubmitting(true);
        setMessage('');
        setIsSuccess(false);
        
        try {
            const response = await fetch(
                'http://localhost:8090/api/v1/user/requestRide',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        riderId,
                        ...formData,
                    }),
                }
            );

            const data = await response.json();
            if (data) {
                setRideDetails(data);
                
                setIsSuccess(true);
                setFormData({ source: '', destination: '', pickupTime: '', pickupDate: '' });
                if(response.status === 200){
                    setMessage('Ride details fetched successfully!');
                    setridAvailable(true)
                }else{
                    setMessage("No Rides Found!")
                    setridAvailable(false)
                }
            } else {
                setMessage('Failed to fetch ride details.');
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while fetching ride details.');
            setIsSuccess(false);
        } finally {
            setLoading(false);
            setTimeout(() => setIsSubmitting(false), 500);
        }
    };

    const handleCapacitySelect = async () => {
        if (!selectedCapacity) {
            setMessage('Please select a seating capacity.');
            return;
        }
    
        setIsSubmitting(true);
        try {
            // Ensure pickupDate is in the correct format (YYYY-MM-DD)
            const formattedPickupDate = new Date(rideDetails.date_t).toISOString().split('T')[0];
    
            const response = await axios.post(
                'http://localhost:8090/api/v1/user/requestDriver',
                {
                    rideId: rideDetails.ID,
                    driverId: rideDetails.driver_id, // Assuming driver_id is part of rideDetails
                    source: rideDetails.source,
                    destination: rideDetails.destination,
                    pickupTime: rideDetails.pickup_time,
                    pickupDate: formattedPickupDate, // Use the formatted date
                    req_seating:selectedCapacity,
                },
                {
                    withCredentials: true, // This enables sending cookies with the request
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if (response.data.success) {
                setMessage('Successfully requested the driver!');
                setIsSuccess(true);
            } else {
                setMessage(response.data.message || 'Request failed.');
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while requesting the driver.');
            setIsSuccess(false);
        } finally {
            setTimeout(() => setIsSubmitting(false), 500);
        }
    };
    
    
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6 lg:p-8 w-full">
            <div className="max-w-xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl text-center font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Request a Ride
                        </h2>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg transition-all duration-300 transform ${
                            isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        } ${isSubmitting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
                            {message}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="source"
                                placeholder="Pickup Location"
                                value={formData.source}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="destination"
                                placeholder="Destination"
                                value={formData.destination}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="time"
                                    name="pickupTime"
                                    value={formData.pickupTime}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="date"
                                    name="pickupDate"
                                    value={formData.pickupDate}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || isSubmitting}
                            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium shadow-lg
                                transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl
                                ${(loading || isSubmitting) ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    Requesting...
                                </span>
                            ) : 'Request Ride'}
                        </button>
                    </form>

                    {rideDetails && rideavailable &&(
                        <div className={`mt-8 space-y-4 transition-all duration-500 ${
                            isSubmitting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                        }`}>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Available Ride Details
                            </h3>
                            
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                {/* Route Information */}
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex flex-col items-center">
                                            <Navigation className="h-5 w-5 text-blue-500" />
                                            <div className="w-0.5 h-10 bg-gray-200 my-1"></div>
                                            <MapPin className="h-5 w-5 text-red-500" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Pickup Location</p>
                                                <p className="text-gray-800">{rideDetails.source}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Destination</p>
                                                <p className="text-gray-800">{rideDetails.destination}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Time and Vehicle Information */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Pickup Time</p>
                                                <p className="text-gray-800">{rideDetails.pickup_time}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Date</p>
                                                <p className="text-gray-800">
                                                    {new Date(rideDetails.date_t).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicle Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                        <div className="flex items-center space-x-2">
                                            <Car className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Vehicle Type</p>
                                                <p className="text-gray-800">{rideDetails.vehicle_t}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                        <div className="flex items-center space-x-2">
                                            <Users className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Available Seats</p>
                                                <p className="text-gray-800">{rideDetails.seating_capacity}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <select
                                        className="w-full pl-4 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        value={selectedCapacity}
                                        onChange={(e) => setSelectedCapacity(e.target.value)}
                                    >
                                        <option value="">Select number of seats</option>
                                        {[...Array(rideDetails.seating_capacity)].map((_, index) => (
                                            <option key={index} value={index + 1}>
                                                {index + 1} {index === 0 ? 'seat' : 'seats'}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={handleCapacitySelect}
                                        disabled={isSubmitting}
                                        className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium
                                            transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl
                                            ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'}`}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                                Confirming...
                                            </span>
                                        ) : 'Confirm Ride'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateRider;