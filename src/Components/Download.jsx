import React, { useState } from 'react';
import axios from 'axios';

const Downloads = () => {
    const [riderId, setRiderId] = useState('');
    const [driverId, setDriverId] = useState('');

    // Function to download all data
    const handleDownloadAll = () => {
        window.open('http://localhost:8090/api/v1/admin/downloadPdf', '_blank');
    };

    // Function to download filtered data based on rider and driver IDs
    const handleDownloadFiltered = async () => {
        try {
            const queryParams = [];
            if (riderId) queryParams.push(`riderId=${riderId}`);
            if (driverId) queryParams.push(`driverId=${driverId}`);

            const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
            const url = `http://localhost:8090/api/v1/admin/download-Pdf${queryString}`;
            
            // Make the request using axios
            const response = await axios.get(url, { responseType: 'blob' });

            // Create a link element to simulate file download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(response.data); // Blob data
            link.download = 'rides_data.pdf';  // Set default file name
            link.click();  // Simulate clicking the link to download the file
        } catch (error) {
            console.error('Error downloading filtered data:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Downloads</h1>
            <div className="mb-4">
                <label className="block mb-2 font-semibold">Rider ID:</label>
                <input
                    type="text"
                    value={riderId}
                    onChange={(e) => setRiderId(e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                    placeholder="Enter Rider ID"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 font-semibold">Driver ID:</label>
                <input
                    type="text"
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                    placeholder="Enter Driver ID"
                />
            </div>
            <div className="flex space-x-4">
                <button
                    className="border p-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-400"
                    onClick={handleDownloadAll}
                >
                    Download All Data
                </button>
                <button
                    className="border p-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-400"
                    onClick={handleDownloadFiltered}
                >
                    Download Filtered Data
                </button>
            </div>
        </div>
    );
};

export default Downloads;
