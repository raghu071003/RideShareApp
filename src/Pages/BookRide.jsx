import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { Loader2, MapPin, Clock, Calendar, Car, Users, ArrowRight, Navigation, IndianRupee } from 'lucide-react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import UpcomingRides from '../Components/UpcomingRides';
import CompletedRides from '../Components/CompletedRides';
import { extract, ratio } from 'fuzzball';
import { availableLocations } from '../assets/constants';


// Replace with your Mapbox access token
mapboxgl.accessToken = "pk.eyJ1Ijoic2FpcmFnaHUiLCJhIjoiY20wbTVibnFnMGI1dzJwczhiaGV1ZzRpNyJ9.bmz6PzeKxEIQSXCR7OxYXA";

const UpdateRider = () => {
    const { riderId } = useAuth();
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        pickupTime: '',
        pickupDate: '',
    });

    // Add this state to track if we're currently selecting a suggestion
    const [isSelectingSuggestion, setIsSelectingSuggestion] = useState(false);
    const [rideDetails, setRideDetails] = useState(null);
    const [selectedCapacity, setSelectedCapacity] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rideavailable, setridAvailable] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [price, setPrice] = useState();
    const [sourceSuggestions, setSourceSuggestions] = useState([]); // Separate state for source suggestions
    const [destinationSuggestions, setDestinationSuggestions] = useState([]); // Separate state for destination suggestions
    const [suggestions, setSuggestions] = useState([]);
    // Map refs
    const mapContainer = useRef(null);
    const map = useRef(null);
    const sourceMarker = useRef(null);
    const destinationMarker = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Generate suggestions using fuzzball
        if (name === 'source') {
            const newSuggestions = extract(value, availableLocations, { scorer: ratio });
            setSourceSuggestions(newSuggestions.map(([suggestion]) => suggestion));
            setDestinationSuggestions([]); // Clear destination suggestions
        } else if (name === 'destination') {
            const newSuggestions = extract(value, availableLocations, { scorer: ratio });
            setDestinationSuggestions(newSuggestions.map(([suggestion]) => suggestion));
            setSourceSuggestions([]); // Clear source suggestions
        }
    };

    // Handle input focus to show suggestions
    const handleFocus = (e) => {
        const { name } = e.target;
        if (name === 'source') {
            const newSuggestions = extract(formData.source, availableLocations, { scorer: ratio });
            setSourceSuggestions(newSuggestions.map(([suggestion]) => suggestion));
        } else if (name === 'destination') {
            const newSuggestions = extract(formData.destination, availableLocations, { scorer: ratio });
            setDestinationSuggestions(newSuggestions.map(([suggestion]) => suggestion));
        }
    };

    // Handle input blur to clear suggestions
    const handleBlur = (e) => {
        // Only clear suggestions if we're not currently selecting one
        setTimeout(() => {
            if (!isSelectingSuggestion) {
                const { name } = e.target;
                if (name === 'source') {
                    setSourceSuggestions([]);
                } else if (name === 'destination') {
                    setDestinationSuggestions([]);
                }
            }
        }, 200); // Add a small delay to allow click event to fire first
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion, type) => {
        setIsSelectingSuggestion(true);

        if (type === 'source') {
            setFormData(prev => ({ ...prev, source: suggestion }));
            setSourceSuggestions([]);
        } else if (type === 'destination') {
            setFormData(prev => ({ ...prev, destination: suggestion }));
            setDestinationSuggestions([]);
        }

        // Reset the selecting state after a short delay
        setTimeout(() => {
            setIsSelectingSuggestion(false);
        }, 300);
    };


    // Function to get coordinates from address
    const getCoordinates = async (address) => {
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        if (data.features.length === 0) throw new Error(`No results found for ${address}`);
        return data.features[0].center;
    };

    // Function to draw route between two points
    const drawRoute = async (sourceCoords, destCoords) => {
        const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${sourceCoords[0]},${sourceCoords[1]};${destCoords[0]},${destCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();

        if (data.code !== 'Ok') throw new Error('Unable to find route');

        // Remove existing route layer and source
        if (map.current.getSource('route')) {
            map.current.removeLayer('route');
            map.current.removeSource('route');
        }

        // Add route to map
        map.current.addSource('route', {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: data.routes[0].geometry,
            },
        });

        map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
                'line-join': 'round',
                'line-cap': 'round',
            },
            paint: {
                'line-color': '#3b82f6',
                'line-width': 4,
            },
        });

        const coordinates = data.routes[0].geometry.coordinates;
        const bounds = coordinates.reduce((bounds, coord) => bounds.extend(coord), new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        map.current.fitBounds(bounds, {
            padding: 50,
        });

        // Return distance and duration
        return {
            distance: data.routes[0].distance, // in meters
            duration: data.routes[0].duration, // in seconds
        };
    };
    const initializeMap = async (sourceAddr, destAddr) => {
        try {
            const sourceCoords = await getCoordinates(sourceAddr);
            const destCoords = await getCoordinates(destAddr);

            if (!map.current) {
                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: sourceCoords,
                    zoom: 12,
                });

                map.current.addControl(new mapboxgl.NavigationControl());
            }

            // Add markers
            if (sourceMarker.current) sourceMarker.current.remove();
            if (destinationMarker.current) destinationMarker.current.remove();

            sourceMarker.current = new mapboxgl.Marker({ color: '#22c55e' })
                .setLngLat(sourceCoords)
                .addTo(map.current);

            destinationMarker.current = new mapboxgl.Marker({ color: '#ef4444' })
                .setLngLat(destCoords)
                .addTo(map.current);

            // Draw route and get distance and duration
            const routeInfo = await drawRoute(sourceCoords, destCoords);

            // Display distance and duration in the UI
            setRideDetails((prevDetails) => ({
                ...prevDetails,
                distance: (routeInfo.distance / 1000).toFixed(2) + ' km',
                duration: (routeInfo.duration / 60).toFixed(2) + ' min',
                price: Math.round((routeInfo.distance / 1000).toFixed(2)) > 20 ? Math.round((routeInfo.distance / 1000).toFixed(2)) * 5 : 40
            }));
        } catch (error) {
            console.error('Map initialization error:', error);
            setMessage('Error loading map. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setIsSubmitting(true);
        setMessage('');
        setIsSuccess(false);


        try {
            const response = await axios.post(
                'http://localhost:8090/api/v1/user/requestRide',
                {
                    riderId,
                    ...formData,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = response.data; // axios automatically parses JSON
            if (data) {
                setRideDetails(data);
                setIsSuccess(true);
                console.log(response.data);

                if (response.status === 200 && (response.data.pickup_time || response.time)) {
                    setMessage('Ride details fetched successfully!');
                    setridAvailable(true);
                    setShowMap(true);

                    // Initialize map after successful ride request
                    await initializeMap(formData.source, formData.destination);
                    // console.log(rideDetails);
                    // console.log(response.data);


                } else {
                    setMessage("No Rides Found!");
                    setridAvailable(false);
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
                    req_seating: selectedCapacity,
                    price: rideDetails.price
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
                        <div className={`mb-6 p-4 rounded-lg transition-all duration-300 transform ${isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            } ${isSubmitting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
                            {message}
                        </div>
                    )}

                    {!showMap ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Pickup Location */}
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="source"
                                    placeholder="Pickup Location"
                                    value={formData.source}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur} // Add onBlur handler here
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {sourceSuggestions.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-auto">
                                        {sourceSuggestions.map((suggestion, index) => (
                                            <li
                                                key={index}
                                                onMouseDown={(e) => {
                                                    e.preventDefault(); // Prevent blur event from firing
                                                    handleSuggestionClick(suggestion, 'source');
                                                }}
                                                className="cursor-pointer p-2 hover:bg-gray-100"
                                            >
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>

                            {/* Destination */}
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="destination"
                                    placeholder="Destination"
                                    value={formData.destination}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur} // Add onBlur handler here
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {destinationSuggestions.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-auto">
                                        {destinationSuggestions.map((suggestion, index) => (
                                            <li
                                                key={index}
                                                onMouseDown={(e) => {
                                                    e.preventDefault(); // Prevent blur event from firing
                                                    handleSuggestionClick(suggestion, 'destination');
                                                }}
                                                className="cursor-pointer p-2 hover:bg-gray-100"
                                            >
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Pickup Time and Date */}
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

                            {/* Submit Button */}
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

                    ) : (
                        <div className="space-y-4">
                            {/* Map Container */}
                            <div
                                ref={mapContainer}
                                className="w-full h-64 rounded-lg overflow-hidden border border-gray-200 shadow-inner"
                            />

                            {/* Existing ride details section */}
                            {rideDetails && rideavailable && (
                                <div key={rideDetails.ID} className={`space-y-4 transition-all duration-500 ${isSubmitting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                                    }`}>
                                    {/* ... (keeping the existing ride details JSX) */}
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
                                                <div className='text-sm font-medium text-gray-600'>Driver Id : <span className='text-gray-800'>{rideDetails.driver_id}</span></div>
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
                                                        <p className="text-sm font-medium text-gray-600">Seating Capacity</p>
                                                        <p className="text-gray-800">{rideDetails.seating_capacity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">Duration</p>
                                                        <p className="text-gray-800">{rideDetails.duration}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">Distance</p>
                                                        <p className="text-gray-800">{rideDetails.distance}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                                <div className="flex items-center space-x-2">
                                                    <IndianRupee className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">Price</p>
                                                        <p className="text-gray-800">
                                                            {rideDetails.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            )}

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
                    )}
                </div>
            </div>
            <UpcomingRides />
            <CompletedRides />
        </div>
    );
};

export default UpdateRider;
