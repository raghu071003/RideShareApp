import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxRouting = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    // Replace with your Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FpcmFnaHUiLCJhIjoiY20wbTVibnFnMGI1dzJwczhiaGV1ZzRpNyJ9.bmz6PzeKxEIQSXCR7OxYXA';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40], // Default center
      zoom: 9
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    return () => map.current?.remove();
  }, []);

  // Function to get coordinates from address using Mapbox Geocoding API
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
        geometry: data.routes[0].geometry
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
        'line-width': 4
      }
    });

    // Fit bounds to show the entire route
    const coordinates = data.routes[0].geometry.coordinates;
    const bounds = coordinates.reduce((bounds, coord) => {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

    map.current.fitBounds(bounds, {
      padding: 50
    });

    return data.routes[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get coordinates for both addresses
      const sourceCoords = await getCoordinates(source);
      const destCoords = await getCoordinates(destination);

      // Add markers
      const markers = document.getElementsByClassName('marker');
      while (markers[0]) {
        markers[0].remove();
      }

      // Add source marker
      new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat(sourceCoords)
        .addTo(map.current);

      // Add destination marker
      new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(destCoords)
        .addTo(map.current);

      // Draw route
      const route = await drawRoute(sourceCoords, destCoords);

      // Add distance and duration info
      const distance = (route.distance / 1000).toFixed(1);
      const duration = Math.round(route.duration / 60);

      setError(`Distance: ${distance} km, Duration: ${duration} minutes`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                Source
              </label>
              <input
                type="text"
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                         shadow-sm focus:outline-none focus:ring-blue-500 
                         focus:border-blue-500"
                placeholder="Enter source address"
                required
              />
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                Destination
              </label>
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                         shadow-sm focus:outline-none focus:ring-blue-500 
                         focus:border-blue-500"
                placeholder="Enter destination address"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent 
                     rounded-md shadow-sm text-sm font-medium text-white 
                     bg-blue-600 hover:bg-blue-700 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                     disabled:opacity-50"
          >
            {loading ? 'Finding Route...' : 'Show Route'}
          </button>
        </form>

        {error && (
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
            {error}
          </div>
        )}

        <div 
          ref={mapContainer} 
          className="w-full h-96 rounded-lg overflow-hidden"
        />
      </div>
    </div>
  );
};

export default MapboxRouting;












// import React, { useState, useRef, useEffect } from 'react';
// import { useAuth } from '../Context/AuthContext';
// import { Loader2, MapPin, Clock, Calendar, Car, Users, ArrowRight, Navigation } from 'lucide-react';
// import axios from 'axios';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';

// // Replace with your Mapbox access token
// mapboxgl.accessToken = 'pk.eyJ1Ijoic2FpcmFnaHUiLCJhIjoiY20wbTVibnFnMGI1dzJwczhiaGV1ZzRpNyJ9.bmz6PzeKxEIQSXCR7OxYXA';

// const UpdateRider = () => {
//     const { riderId } = useAuth();
//     const mapContainer = useRef(null);
//     const map = useRef(null);
//     const [showMap, setShowMap] = useState(false);
//     const [formData, setFormData] = useState({
//         source: '',
//         destination: '',
//         pickupTime: '',
//         pickupDate: '',
//     });
//     const [rideDetails, setRideDetails] = useState(null);
//     const [selectedCapacity, setSelectedCapacity] = useState('');
//     const [message, setMessage] = useState('');
//     const [isSuccess, setIsSuccess] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [rideavailable, setridAvailable] = useState(false);

//     const initializeMap = async (sourceAddress, destAddress) => {
//         try {
//             // Get coordinates for source and destination
//             const sourceCoords = await getCoordinates(sourceAddress);
//             const destCoords = await getCoordinates(destAddress);

//             // Initialize map
//             if (!map.current) {
//                 map.current = new mapboxgl.Map({
//                     container: mapContainer.current,
//                     style: 'mapbox://styles/mapbox/streets-v12',
//                     center: sourceCoords,
//                     zoom: 12
//                 });

//                 map.current.addControl(new mapboxgl.NavigationControl());
//             }

//             // Add markers
//             new mapboxgl.Marker({ color: '#22c55e' })
//                 .setLngLat(sourceCoords)
//                 .addTo(map.current);

//             new mapboxgl.Marker({ color: '#ef4444' })
//                 .setLngLat(destCoords)
//                 .addTo(map.current);

//             // Draw route
//             const response = await fetch(
//                 `https://api.mapbox.com/directions/v5/mapbox/driving/${sourceCoords[0]},${sourceCoords[1]};${destCoords[0]},${destCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
//             );
//             const data = await response.json();

//             if (map.current.getSource('route')) {
//                 map.current.removeLayer('route');
//                 map.current.removeSource('route');
//             }

//             map.current.addSource('route', {
//                 type: 'geojson',
//                 data: {
//                     type: 'Feature',
//                     properties: {},
//                     geometry: data.routes[0].geometry
//                 }
//             });

//             map.current.addLayer({
//                 id: 'route',
//                 type: 'line',
//                 source: 'route',
//                 layout: {
//                     'line-join': 'round',
//                     'line-cap': 'round'
//                 },
//                 paint: {
//                     'line-color': '#3b82f6',
//                     'line-width': 4
//                 }
//             });

//             // Fit bounds to show the entire route
//             const coordinates = data.routes[0].geometry.coordinates;
//             const bounds = coordinates.reduce((bounds, coord) => {
//                 return bounds.extend(coord);
//             }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

//             map.current.fitBounds(bounds, {
//                 padding: 50
//             });
//         } catch (error) {
//             console.error('Error initializing map:', error);
//             setMessage('Error loading map');
//         }
//     };

//     const getCoordinates = async (address) => {
//         const response = await fetch(
//             `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
//         );
//         const data = await response.json();
//         if (data.features.length === 0) throw new Error(`No results found for ${address}`);
//         return data.features[0].center;
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setIsSubmitting(true);
//         setMessage('');
//         setIsSuccess(false);
        
//         try {
//             const response = await fetch(
//                 'http://localhost:8090/api/v1/user/requestRide',
//                 {
//                     method: 'POST',
//                     credentials: 'include',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         riderId,
//                         ...formData,
//                     }),
//                 }
//             );

//             const data = await response.json();
//             if (data) {
//                 setRideDetails(data);
//                 setIsSuccess(true);
//                 if(response.status === 200){
//                     setMessage('Ride details fetched successfully!');
//                     setridAvailable(true);
//                     setShowMap(true);
//                     // Initialize map after response
//                     await initializeMap(formData.source, formData.destination);
//                 }else{
//                     setMessage("No Rides Found!")
//                     setridAvailable(false)
//                 }
//             } else {
//                 setMessage('Failed to fetch ride details.');
//                 setIsSuccess(false);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             setMessage('An error occurred while fetching ride details.');
//             setIsSuccess(false);
//         } finally {
//             setLoading(false);
//             setTimeout(() => setIsSubmitting(false), 500);
//         }
//     };

//     const handleCapacitySelect = async () => {
//         if (!selectedCapacity) {
//             setMessage('Please select a seating capacity.');
//             return;
//         }
    
//         setIsSubmitting(true);
//         try {
//             // Ensure pickupDate is in the correct format (YYYY-MM-DD)
//             const formattedPickupDate = new Date(rideDetails.date_t).toISOString().split('T')[0];
    
//             const response = await axios.post(
//                 'http://localhost:8090/api/v1/user/requestDriver',
//                 {
//                     rideId: rideDetails.ID,
//                     driverId: rideDetails.driver_id, // Assuming driver_id is part of rideDetails
//                     source: rideDetails.source,
//                     destination: rideDetails.destination,
//                     pickupTime: rideDetails.pickup_time,
//                     pickupDate: formattedPickupDate, // Use the formatted date
//                     req_seating:selectedCapacity,
//                 },
//                 {
//                     withCredentials: true, // This enables sending cookies with the request
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );
    
//             if (response.data.success) {
//                 setMessage('Successfully requested the driver!');
//                 setIsSuccess(true);
//             } else {
//                 setMessage(response.data.message || 'Request failed.');
//                 setIsSuccess(false);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             setMessage('An error occurred while requesting the driver.');
//             setIsSuccess(false);
//         } finally {
//             setTimeout(() => setIsSubmitting(false), 500);
//         }
//     };
    
    
    

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6 lg:p-8 w-full">
//             <div className="max-w-xl mx-auto">
//                 <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl p-6">
//                     <div className="mb-6">
//                         <h2 className="text-2xl text-center font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                             Request a Ride
//                         </h2>
//                     </div>

//                     {message && (
//                         <div className={`mb-6 p-4 rounded-lg transition-all duration-300 transform ${
//                             isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
//                         } ${isSubmitting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
//                             {message}
//                         </div>
//                     )}
                    
//                     {!showMap ? (
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             {/* Existing form fields */}
//                             <div className="relative">
//                                 <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                                 <input
//                                     type="text"
//                                     name="source"
//                                     placeholder="Pickup Location"
//                                     value={formData.source}
//                                     onChange={handleChange}
//                                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                     required
//                                 />
//                             </div>

//                             <div className="relative">
//                                 <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                                 <input
//                                     type="text"
//                                     name="destination"
//                                     placeholder="Destination"
//                                     value={formData.destination}
//                                     onChange={handleChange}
//                                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                     required
//                                 />
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="relative">
//                                     <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                                     <input
//                                         type="time"
//                                         name="pickupTime"
//                                         value={formData.pickupTime}
//                                         onChange={handleChange}
//                                         className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="relative">
//                                     <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                                     <input
//                                         type="date"
//                                         name="pickupDate"
//                                         value={formData.pickupDate}
//                                         onChange={handleChange}
//                                         className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={loading || isSubmitting}
//                                 className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium shadow-lg
//                                     transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl
//                                     ${(loading || isSubmitting) ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'}`}
//                             >
//                                 {loading ? (
//                                     <span className="flex items-center justify-center">
//                                         <Loader2 className="animate-spin mr-2 h-5 w-5" />
//                                         Requesting...
//                                     </span>
//                                 ) : 'Request Ride'}
//                             </button>
//                         </form>
//                     ) : (
//                         <div className="space-y-6">
//                             {/* Map Container */}
//                             <div 
//                                 ref={mapContainer} 
//                                 className="w-full h-64 rounded-lg overflow-hidden shadow-lg"
//                             />
                            
//                             {/* Existing ride details section */}
//                             {rideDetails && rideavailable && (
//                                 <div className={`space-y-4 transition-all duration-500 ${
//                                     isSubmitting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
//                                 }`}>
//                                     {/* ... (keeping the existing ride details JSX) */}
//                                     <div className="bg-gray-50 p-4 rounded-lg space-y-4">
//                                         {/* Route Information */}
//                                         <div className="bg-white rounded-lg p-4 shadow-sm">
//                                             <div className="flex items-start space-x-3">
//                                                 <div className="flex flex-col items-center">
//                                                     <Navigation className="h-5 w-5 text-blue-500" />
//                                                     <div className="w-0.5 h-10 bg-gray-200 my-1"></div>
//                                                     <MapPin className="h-5 w-5 text-red-500" />
//                                                 </div>
//                                                 <div className="flex-1 space-y-2">
//                                                     <div>
//                                                         <p className="text-sm font-medium text-gray-600">Pickup Location</p>
//                                                         <p className="text-gray-800">{rideDetails.source}</p>
//                                                     </div>
//                                                     <div>
//                                                         <p className="text-sm font-medium text-gray-600">Destination</p>
//                                                         <p className="text-gray-800">{rideDetails.destination}</p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Time and Vehicle Information */}
//                                         <div className="grid grid-cols-2 gap-4">
//                                             <div className="bg-white p-3 rounded-lg shadow-sm">
//                                                 <div className="flex items-center space-x-2">
//                                                     <Clock className="h-5 w-5 text-gray-500" />
//                                                     <div>
//                                                         <p className="text-sm font-medium text-gray-600">Pickup Time</p>
//                                                         <p className="text-gray-800">{rideDetails.pickup_time}</p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="bg-white p-3 rounded-lg shadow-sm">
//                                                 <div className="flex items-center space-x-2">
//                                                     <Calendar className="h-5 w-5 text-gray-500" />
//                                                     <div>
//                                                         <p className="text-sm font-medium text-gray-600">Date</p>
//                                                         <p className="text-gray-800">
//                                                             {new Date(rideDetails.date_t).toLocaleDateString()}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Vehicle Details */}
//                                         <div className="grid grid-cols-2 gap-4">
//                                             <div className="bg-white p-3 rounded-lg shadow-sm">
//                                                 <div className="flex items-center space-x-2">
//                                                     <Car className="h-5 w-5 text-gray-500" />
//                                                     <div>
//                                                         <p className="text-sm font-medium text-gray-600">Vehicle Type</p>
//                                                         <p className="text-gray-800">{rideDetails.vehicle_t}</p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="bg-white p-3 rounded-lg shadow-sm">
//                                                 <div className="flex items-center space-x-2">
//                                                     <Users className="h-5 w-5 text-gray-500" />
//                                                     <div>
//                                                     <p className="text-sm font-medium text-gray-600">Seating Capacity</p>
//                                                         <p className="text-gray-800">{rideDetails.seating_required}</p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             <button
//                                 type="button"
//                                 onClick={() => setShowMap(false)}
//                                 className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-medium shadow-lg
//                                     transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl
//                                     hover:opacity-90"
//                             >
//                                 Modify Journey
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UpdateRider;