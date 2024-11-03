import React, { useState } from 'react';
import axios from 'axios';

const AddRider = ({ onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [empId,setEmpId] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8090/api/v1/admin/addRider', {
                name,
                email,
                password,
                empId
            },{withCredentials:true});
            if(response.status === 200){
                alert("Rider added successfully");
            }
            onClose(); // Close the modal after submission
        } catch (error) {
            console.error('Error adding rider:', error);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-2xl font-bold mb-4">Add Rider</h2>
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
                            placeholder="Employee ID"
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value)}
                            required
                            className="border rounded-lg w-full p-2"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-500"
                        >
                            Add Rider
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

export default AddRider;
