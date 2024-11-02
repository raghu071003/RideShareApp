// src/UpdateRide.js

import React, { useState } from 'react';
import axios from 'axios';
import { MapPin, Car, Calendar, Clock, Users } from 'lucide-react'; // Importing icons from Lucide

const UpdateRide = () => {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [vehicleType, setVehicleType] = useState('Car'); // Default to 'Car'
    const [seatingCapacity, setSeatingCapacity] = useState(1);

    const driverId = localStorage.getItem('driverId');

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:8090/api/v1/driver/updateRide', {
                driverId,
                source,
                destination,
                pickupTime,
                date: pickupDate,
                vehicleType,
                seatingCapacity,
            }, { withCredentials: true });
            alert('Ride details updated successfully');
        } catch (error) {
            alert('Error updating ride details');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 w-full">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Ride Details</h3>
                <form className="flex flex-col space-y-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <MapPin className="w-5 h-5 text-gray-400 ml-3" />
                        <input
                            type="text"
                            placeholder="Source"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                            required
                        />
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <MapPin className="w-5 h-5 text-gray-400 ml-3" />
                        <input
                            type="text"
                            placeholder="Destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                            required
                        />
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <Clock className="w-5 h-5 text-gray-400 ml-3" />
                        <input
                            type="time"
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            className="p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                            required
                        />
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <Calendar className="w-5 h-5 text-gray-400 ml-3" />
                        <input
                            type="date"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            className="p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                            required
                        />
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <Car className="w-5 h-5 text-gray-400 ml-3" />
                        <select
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                            className="p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                            required
                        >
                            <option value="Car">Car</option>
                            <option value="Bike">Bike</option>
                            <option value="Van">Van</option>
                            <option value="Bus">Bus</option>
                        </select>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <Users className="w-5 h-5 text-gray-400 ml-3" />
                        <select
                            value={seatingCapacity}
                            onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                            className="p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                            required
                        >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={4}>4</option>
                            <option value={6}>6</option>
                            <option value={8}>8</option>
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out shadow-md"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateRide;
