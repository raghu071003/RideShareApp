import React, { useState } from 'react';
import axios from 'axios';

const AddDriver = ({ onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobileNo, setMobileNo] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8090/api/v1/admin/addDriver', {
                name,
                email,
                password,
                mobile_no: mobileNo,
            },{withCredentials:true});
            console.log('Driver added:', response.data);
            onClose(); // Close the modal after submission
        } catch (error) {
            console.error('Error adding driver:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-2xl font-bold mb-4">Add Driver</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="border rounded-lg w-full p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border rounded-lg w-full p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border rounded-lg w-full p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Mobile No"
                            value={mobileNo}
                            onChange={(e) => setMobileNo(e.target.value)}
                            required
                            className="border rounded-lg w-full p-2"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-500"
                        >
                            Add Driver
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDriver;
