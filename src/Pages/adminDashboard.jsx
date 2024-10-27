import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddRider from '../Components/addRider';
import AddDriver from '../Components/AddDriver';

const AdminDashboard = () => {
    const [rides, setRides] = useState([]); // State to hold rides data
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(''); // State for error messages
    const [isRiderModalOpen, setRiderModalOpen] = useState(false); // State for rider modal
    const [isDriverModalOpen, setDriverModalOpen] = useState(false); // State for driver modal

    // Fetch rides data from the backend
    const fetchRides = async () => {
        try {
            const response = await axios.get('http://localhost:8090/api/v1/admin/rides');
            setRides(response.data);
        } catch (err) {
            console.error("Error fetching rides:", err);
            setError('Failed to fetch rides data.');
        } finally {
            setLoading(false); // Set loading to false after fetch is complete
        }
    };

    useEffect(() => {
        fetchRides(); // Call the fetch function on component mount
    }, []);

    const convert = (date) => {
        const dateString = date;
        const dateObject = new Date(dateString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const dateOnly = dateObject.toLocaleDateString('en-CA', options); // Formats as YYYY-MM-DD
        return dateOnly;
    };

    const handleDownload = async () => {
        window.open('http://localhost:8090/api/v1/admin/downloadPdf', '_blank');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            {loading ? (
                <p>Loading rides data...</p> // Loading message
            ) : error ? (
                <p className="text-red-500">{error}</p> // Error message
            ) : (
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Ride ID</th>
                            <th className="border border-gray-300 px-4 py-2">Rider ID</th>
                            <th className="border border-gray-300 px-4 py-2">Driver ID</th>
                            <th className="border border-gray-300 px-4 py-2">Start Location</th>
                            <th className="border border-gray-300 px-4 py-2">End Location</th>
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                            <th className="border border-gray-300 px-4 py-2">Status</th>
                            <th className="border border-gray-300 px-4 py-2">Seating Capacity</th>
                            <th className="border border-gray-300 px-4 py-2">Pickup Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rides.map((ride) => (
                            <tr key={ride.id}>
                                <td className="border border-gray-300 px-4 py-2">{ride.ride_id}</td>
                                <td className="border border-gray-300 px-4 py-2">{ride.rider_id}</td>
                                <td className="border border-gray-300 px-4 py-2">{ride.driver_id}</td>
                                <td className="border border-gray-300 px-4 py-2">{ride.source}</td>
                                <td className="border border-gray-300 px-4 py-2">{ride.destination}</td>
                                <td className="border border-gray-300 px-4 py-2">{convert(ride.date)}</td>
                                <td className="border border-gray-300 px-4 py-2">{ride.status}</td>
                                <td className="border border-gray-300 px-4 py-2">{ride.seating_capacity}</td>
                                <td className="border border-gray-300 px-4 py-2">{ride.pickup_time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div>
                <button className="border p-3 bg-blue-600 rounded-xl m-3 text-white font-bold hover:bg-blue-400" onClick={handleDownload}>
                    Download PDF
                </button>
                <button className="border p-3 bg-blue-600 rounded-xl m-3 text-white font-bold hover:bg-blue-400" onClick={() => setRiderModalOpen(true)}>
                    Add Rider
                </button>
                <button className="border p-3 bg-blue-600 rounded-xl m-3 text-white font-bold hover:bg-blue-400" onClick={() => setDriverModalOpen(true)}>
                    Add Driver
                </button>
            </div>

            {/* Modal for adding rider */}
            {isRiderModalOpen && (
                <div className="modal-overlay">
                    <AddRider onClose={() => setRiderModalOpen(false)} />
                </div>
            )}

            {/* Modal for adding driver */}
            {isDriverModalOpen && (
                <div className="modal-overlay">
                    <AddDriver onClose={() => setDriverModalOpen(false)} />
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
