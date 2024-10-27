import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const UpdateRider = () => {
    const { riderId } = useAuth();
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        pickupTime: '',
        pickupDate: '',
    });
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsSuccess(false);
        
        try {
            const response = await axios.post(
                'http://localhost:8090/api/v1/user/update',
                {
                    riderId,
                    ...formData,
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                setMessage('Ride details updated successfully!');
                setIsSuccess(true);
                setFormData({ source: '', destination: '', pickupTime: '', pickupDate: '' }); // Reset form fields
            } else {
                setMessage(response.data.message);
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Error updating rider details:', error);
            setMessage('An error occurred while updating ride details.');
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-blue-400 w-full">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Request Ride</h2>
                {message && (
                    <p className={`text-center mb-4 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="source"
                        placeholder="Source"
                        value={formData.source}
                        onChange={handleChange}
                        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                        required
                    />
                    <input
                        type="text"
                        name="destination"
                        placeholder="Destination"
                        value={formData.destination}
                        onChange={handleChange}
                        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                        required
                    />
                    <input
                        type="time"
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleChange}
                        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                        required
                    />
                    <input
                        type="date"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 ease-in-out"
                        required
                    />
                    <button
                        type="submit"
                        className={`bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Request Ride'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateRider;
