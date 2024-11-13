import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddRider from '../Components/addRider';
import AddDriver from '../Components/AddDriver';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [rides, setRides] = useState([]);
    const [filteredRides, setFilteredRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isRiderModalOpen, setRiderModalOpen] = useState(false);
    const [isDriverModalOpen, setDriverModalOpen] = useState(false);
    const [driverIdQuery, setDriverIdQuery] = useState('');
    const [riderIdQuery, setRiderIdQuery] = useState('');
    const navigate = useNavigate();
    const fetchRides = async () => {
        try {
            const response = await axios.get('http://localhost:8090/api/v1/admin/rides');
            setRides(response.data);
            setFilteredRides(response.data);
        } catch (err) {
            console.error("Error fetching rides:", err);
            setError('Failed to fetch rides data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    useEffect(() => {
        const filtered = rides.filter(ride => {
            const matchesDriverId = driverIdQuery.trim() === '' || ride.driver_id.toString().includes(driverIdQuery);
            const matchesRiderId = riderIdQuery.trim() === '' || ride.rider_id.toString().includes(riderIdQuery);
            return matchesDriverId && matchesRiderId;
        });
        setFilteredRides(filtered);
    }, [driverIdQuery, riderIdQuery, rides]);

    const convert = (date) => {
        const dateObject = new Date(date);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return dateObject.toLocaleDateString('en-CA', options);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Search by Driver ID"
                        value={driverIdQuery}
                        onChange={(e) => setDriverIdQuery(e.target.value)}
                        className="border px-3 py-2 rounded w-40"
                    />
                    <input
                        type="text"
                        placeholder="Search by Rider ID"
                        value={riderIdQuery}
                        onChange={(e) => setRiderIdQuery(e.target.value)}
                        className="border px-3 py-2 rounded w-40"
                    />
                </div>
            </div>
            {loading ? (
                <p>Loading rides data...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
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
                        {filteredRides.map((ride) => (
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
                                <td className="border border-gray-300 px-4 py-2"><button className='border p-2 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-400' onClick={()=>navigate(`/admin/tracking/${ride.driver_id}`)}>Live tracking</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div>
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
