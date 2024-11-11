import React, { useEffect, useState } from 'react';
import axios from 'axios';
const LocationTracker = ({ driverId }) => {
  const [error, setError] = useState(null);


const updateDriverLocation = async (latitude, longitude) => {
  try {
    const response = await axios.post(
      'http://localhost:8090/api/v1/driver/updateDriverLocation',
      {
        latitude,
        longitude,
      },
      {
        withCredentials: true, // Include credentials (cookies, etc.)
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to update location');
    }
  } catch (err) {
    setError('Failed to send location update');
    console.error('Error updating location:', err);
  }
};


  // Function to get current position
  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        updateDriverLocation(newLocation.latitude, newLocation.longitude);
      },
      (err) => {
        setError('Unable to get location: ' + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // Start tracking on component mount
  useEffect(() => {
    let intervalId;

    // Get initial position
    getCurrentPosition();

    // Set up interval to update position every 10 seconds
    intervalId = setInterval(getCurrentPosition, 10000);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Only run once on mount

  return null; // No rendered output
};

export default LocationTracker;
