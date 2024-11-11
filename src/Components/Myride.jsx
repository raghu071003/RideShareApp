import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyRide = () => {
  const [data, setData] = useState(null); // Store fetched data

  // Fetch ride data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8090/api/v1/driver/myride", { withCredentials: true });
        setData(res.data); // Set the fetched data
        console.log(res.data);
        
      } catch (error) {
        console.error("Error fetching ride data", error);
      }
    };

    fetchData();
  }, []); 

  if (!data) {
    return null;
  }

  const { source, destination, pickup_time, date_t } = data.data;

  const [hours, minutes, seconds] = pickup_time.split(':').map(Number);

// Convert to 12-hour format
let period = "AM";
let hours12 = hours;

if (hours >= 12) {
  period = "PM";
  if (hours > 12) hours12 = hours - 12; // Convert to 12-hour clock
} else if (hours === 0) {
  hours12 = 12; // Handle midnight case
}

const formattedTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;

  return (
    <div className="fixed top-20 left-2 m-4 p-4 bg-white shadow-lg rounded-lg w-72 z-50">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">My Ride</h3>
      <div className="text-gray-600">
        <p className="mb-1"><strong>Source:</strong> {source}</p>
        <p className="mb-1"><strong>Destination:</strong> {destination}</p>
        <p className="mb-1"><strong>Pickup Time:</strong> {formattedTime}</p>
        <p className="mb-1"><strong>Pickup Date:</strong> {new Date(date_t).toLocaleDateString('en-US')}</p>
      </div>
    </div>
  );
};

export default MyRide;
