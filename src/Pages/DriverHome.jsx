import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Car } from 'lucide-react';
import Notification from '../Components/Notification';
import UpdateRideButton from '../Components/UpdateRideButton';
import ReactDOM from 'react-dom';
import MyRide from '../Components/Myride';


// Replace with your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FpcmFnaHUiLCJhIjoiY20wbTVibnFnMGI1dzJwczhiaGV1ZzRpNyJ9.bmz6PzeKxEIQSXCR7OxYXA';

const DriverHome = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [location, setLocation] = useState({
        lng: null,
        lat: null,
        error: null,
        loading: true
    });
    const markerRef = useRef(null);

    useEffect(() => {
        // Get current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lng: position.coords.longitude,
                        lat: position.coords.latitude,
                        error: null,
                        loading: false
                    });
                },
                (error) => {
                    setLocation(prev => ({
                        ...prev,
                        error: 'Error getting location: ' + error.message,
                        loading: false
                    }));
                }
            );
        } else {
            setLocation(prev => ({
                ...prev,
                error: 'Geolocation is not supported by your browser',
                loading: false
            }));
        }
    }, []);

    // Initialize map when location is available
    useEffect(() => {
        if (location.loading || location.error || !location.lng || !location.lat) return;

        if (map.current) return; // Map already initialized

        // Initialize map with satellite style
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v12', // Satellite style with streets
            center: [location.lng, location.lat],
            zoom: 16, // Increased zoom for better satellite view
            pitch: 45, // Add some tilt to the map
            bearing: 0
        });

        // Add navigation control
        map.current.addControl(
            new mapboxgl.NavigationControl(),
            'top-right'
        );

        const el = document.createElement('div');
        el.className = 'marker bg-white p-2 rounded-full shadow-md';
        el.innerHTML = `
            <Car />
        `;
        ReactDOM.render(
            <Car size={32} color="blue" className="animate-bounce" />, // Customize with size, color, and animation
            el
        );
        markerRef.current = new mapboxgl.Marker(el)
            .setLngLat([location.lng, location.lat])
            .addTo(map.current);

        // Add terrain control if available in the region
        map.current.on('style.load', () => {
            map.current.setFog({
                'color': 'rgb(186, 210, 235)',
                'high-color': 'rgb(36, 92, 223)',
                'horizon-blend': 0.02
            });

            // Add terrain if available
            map.current.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.terrain-rgb',
                'tileSize': 512,
                'maxzoom': 14
            });
            map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [location]);

    // Update driver location in real-time
    useEffect(() => {
        if (!map.current || location.loading || location.error) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const newLng = position.coords.longitude;
                const newLat = position.coords.latitude;

                // Update marker position with smooth animation
                if (markerRef.current) {
                    markerRef.current.setLngLat([newLng, newLat]);
                }

                // Smooth map movement
                map.current.easeTo({
                    center: [newLng, newLat],
                    duration: 2000,
                    essential: true
                });

                setLocation(prev => ({
                    ...prev,
                    lng: newLng,
                    lat: newLat
                }));
            },
            (error) => {
                console.error('Error watching position:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [map.current]);

    return (
        <div className="relative w-full h-screen">
            <Notification />
            <MyRide />
            {location.loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            )}

            {location.error && (
                <div className="absolute inset-x-0 top-4 mx-auto max-w-md z-10 px-4">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg" role="alert">
                        <span className="block sm:inline">{location.error}</span>
                    </div>
                </div>
            )}

            <div ref={mapContainer} className="w-full h-full" />

            {/* {!location.loading && !location.error && (
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg z-10">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">
                        <Car className="inline-block mr-2" />
                        Driver Location
                    </h3>
                    <p className="text-gray-700">Latitude: {location.lat?.toFixed(6)}</p>
                    <p className="text-gray-700">Longitude: {location.lng?.toFixed(6)}</p>
                    <p className="text-green-600 font-medium mt-2">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Online & Available
                    </p>
                </div>
            )} */}
            <UpdateRideButton />
        </div>
    );
};

export default DriverHome;