import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FpcmFnaHUiLCJhIjoiY20wbTVibnFnMGI1dzJwczhiaGV1ZzRpNyJ9.bmz6PzeKxEIQSXCR7OxYXA';

const AdminTracking = () => {
    const [driverId, setDriverId] = useState('');
    const [inputDriverId, setInputDriverId] = useState('');
    const [locationHistory, setLocationHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputDriverId.trim()) {
            setDriverId(inputDriverId.trim());
        }
    };

    // Fetch location history based on driver ID
    useEffect(() => {
        const fetchLocationHistory = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://localhost:8090/api/v1/admin/${driverId}/location-history?hours=24`,{withCredentials:true});
                if (response.data.success) {
                    setLocationHistory(response.data.history);
                } else {
                    setError('Failed to fetch driver location history');
                }
            } catch (err) {
                console.error('Error fetching location history:', err);
                setError('Error fetching driver location history');
            } finally {
                setLoading(false);
            }
        };

        if (driverId) {
            fetchLocationHistory();
        }
    }, [driverId]);

    // Render the map with location history
    useEffect(() => {
        if (!loading && locationHistory.length > 0) {
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/satellite-streets-v11',
                center: [locationHistory[0].longitude, locationHistory[0].latitude],
                zoom: 12
            });

            locationHistory.forEach((location) => {
                new mapboxgl.Marker()
                    .setLngLat([location.longitude, location.latitude])
                    .setPopup(new mapboxgl.Popup().setText(`Last updated: ${new Date(location.last_updated).toLocaleString()}`))
                    .addTo(map);
            });

            return () => map.remove();
        }
    }, [locationHistory, loading]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Driver Location History</h1>

            {!driverId && (
                <div className="mb-4">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Enter Driver ID"
                            value={inputDriverId}
                            onChange={(e) => setInputDriverId(e.target.value)}
                            className="p-2 border rounded-lg"
                        />
                        <button type="submit" className="border p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-400">
                            Fetch History
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading map...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                driverId && (
                    <div>
                        <div id="map" className="w-full h-[600px] border rounded-lg mb-4"></div>
                        <div className="mt-4">
                            <button
                                className="border p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-400"
                                onClick={() => setDriverId('')}
                            >
                                Request Another Driver ID
                            </button>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default AdminTracking;