import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import { MapPin, Car, Calendar, Clock, Users, Navigation } from 'lucide-react';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FpcmFnaHUiLCJhIjoiY20wbTVibnFnMGI1dzJwczhiaGV1ZzRpNyJ9.bmz6PzeKxEIQSXCR7OxYXA';
const UpdateRide = () => {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [vehicleType, setVehicleType] = useState('Car');
    const [seatingCapacity, setSeatingCapacity] = useState(1);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [mapInitialized, setMapInitialized] = useState(false);
    const [routeGeoJSON, setRouteGeoJSON] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const driverId = localStorage.getItem('driverId');
    const mapContainer = useRef(null);
    const map = useRef(null);
    const sourceMarker = useRef(null);
    const destinationMarker = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        // Initialize map on component mount
        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [78.9629, 20.5937], // Default center (India)
                zoom: 4
            });

            map.current.addControl(new mapboxgl.NavigationControl());

            // Set map loaded flag when map is ready
            map.current.on('load', () => {
                setMapLoaded(true);
                setMapInitialized(true);
            });
        }

        // Cleanup on component unmount
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    const getCoordinates = async (address) => {
        const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
        );
        const [lng, lat] = response.data.features[0].center;
        return [lng, lat];
    };

    const calculateDistanceAndDuration = async () => {
        if (!source || !destination) {
            alert('Please enter both source and destination');
            return;
        }

        try {
            setIsLoading(true);
            const sourceCoords = await getCoordinates(source);
            const destCoords = await getCoordinates(destination);

            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${sourceCoords.join(',')};${destCoords.join(',')}`,
                {
                    params: {
                        access_token: mapboxgl.accessToken,
                        geometries: 'geojson',
                    },
                }
            );

            const route = response.data.routes[0];
            setDistance((route.distance / 1000).toFixed(2));
            setDuration((route.duration / 60).toFixed(2));

            // Update markers
            if (sourceMarker.current) sourceMarker.current.remove();
            if (destinationMarker.current) destinationMarker.current.remove();

            sourceMarker.current = new mapboxgl.Marker({ color: '#22c55e' })
                .setLngLat(sourceCoords)
                .addTo(map.current);

            destinationMarker.current = new mapboxgl.Marker({ color: '#ef4444' })
                .setLngLat(destCoords)
                .addTo(map.current);

            // Fit map to show both markers
            const bounds = new mapboxgl.LngLatBounds()
                .extend(sourceCoords)
                .extend(destCoords);
            map.current.fitBounds(bounds, { padding: 50 });

            // Update or add route layer
            if (map.current.getSource('route')) {
                map.current.getSource('route').setData({
                    type: 'Feature',
                    properties: {},
                    geometry: route.geometry
                });
            } else if (mapLoaded) {
                // Add the route source and layer if it doesn't exist
                map.current.addSource('route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: route.geometry
                    }
                });

                map.current.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#3b82f6',
                        'line-width': 4,
                        'line-opacity': 0.75
                    }
                });
            }

        } catch (error) {
            console.error('Error calculating route:', error);
            alert('Error calculating route. Please check the addresses and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            await axios.post('http://localhost:8090/api/v1/driver/updateRide', {
                driverId,
                source,
                destination,
                pickupTime,
                date: pickupDate,
                vehicleType,
                seatingCapacity,
                distance,
                duration
            }, { withCredentials: true });
            alert('Ride details updated successfully');
        } catch (error) {
            alert('Error updating ride details');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-300 p-4 md:p-6 w-full">
            <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-2">
                {/* Form Section */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-center text-gray-800">
                            Update Ride Details
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {/* Location Inputs */}
                        <div className="space-y-4">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Pickup Location"
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                />
                            </div>

                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Drop-off Location"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Time and Date Inputs */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <Clock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="time"
                                    value={pickupTime}
                                    onChange={(e) => setPickupTime(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                />
                            </div>

                            <div className="relative">
                                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="date"
                                    value={pickupDate}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Vehicle and Capacity Selects */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <Car className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <select
                                    value={vehicleType}
                                    onChange={(e) => setVehicleType(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white transition-all duration-200"
                                >
                                    <option value="Car">Car</option>
                                    <option value="Bike">Bike</option>
                                    <option value="Van">Van</option>
                                    <option value="Bus">Bus</option>
                                </select>
                            </div>

                            <div className="relative">
                                <Users className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <select
                                    value={seatingCapacity}
                                    onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white transition-all duration-200"
                                >
                                    {[...Array(10)].map((_, index) => (
                                        <option key={index} value={index + 1}>
                                            {index + 1} {index === 0 ? 'seat' : 'seats'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={calculateDistanceAndDuration}
                                disabled={isLoading}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                <Navigation className="h-5 w-5" />
                                <span>{isLoading ? 'Calculating...' : 'Calculate Route'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                <Car className="h-5 w-5" />
                                <span>{isLoading ? 'Updating...' : 'Update Ride'}</span>
                            </button>
                        </div>

                        {/* Distance and Duration Display */}
                        {distance && duration && (
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex items-center justify-between text-gray-700">
                                    <span>Distance:</span>
                                    <span className="font-semibold">{distance} km</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-700">
                                    <span>Duration:</span>
                                    <span className="font-semibold">{duration} minutes</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div ref={mapContainer} className="h-full min-h-[500px]" />
                </div>
            </div>
        </div>
    );
};

export default UpdateRide;