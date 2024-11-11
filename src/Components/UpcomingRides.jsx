import React, { useEffect, useState } from 'react';
import { User, MapPin, Clock, Users, IndianRupee, XCircle, Monitor } from 'lucide-react'; // Ensure you import the required icons
import axios from 'axios'; // Import axios if you are fetching data
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const UpcomingRides = () => {
  const [loadingRides, setLoadingRides] = useState(true);
  const [upcomingRides, setUpcomingRides] = useState([]);
  const navigate = useNavigate(); // Initialize navigate
  const mobileNumbers = [
    "1234567890",
    "9876543210",
    "5551234567",
    "4449876543",
    "6667890123"
];


  // Fetch upcoming rides data
  useEffect(() => {
    const fetchUpcomingRides = async () => {
      try {
        const response = await axios.get('http://localhost:8090/api/v1/user/upcoming', { withCredentials: true }); // Replace with your API endpoint
        setUpcomingRides(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching upcoming rides:', error);
      } finally {
        setLoadingRides(false);
      }
    };

    fetchUpcomingRides();
  }, []);

  const handlePayment = (ride_id,price) => {
    // Navigate to a dummy payment page, passing the rideId as a parameter
    
    navigate(`/payment/${ride_id}/${price}`);
  };

  return (
    <div className="mt-10">
      <h3 className="text-3xl font-bold mb-6 text-center text-blue-700">Upcoming Rides</h3>
      {loadingRides ? (
        <p className="text-center text-blue-600 text-lg">Loading upcoming rides...</p>
      ) : upcomingRides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingRides.map(ride => (
            <div key={ride.ride_id} className="bg-white border border-gray-200 rounded-lg shadow-md p-6 transition-transform transform hover:-translate-y-2 hover:shadow-lg">
              <h4 className="text-xl font-semibold mb-3 text-blue-700">
                <User className="inline mr-2" /> Ride ID: {ride.ride_id}
              </h4>
              <div className="space-y-2 text-gray-700">
                <p><strong><User className="inline mr-1" /> Driver ID:</strong> {ride.driver_id}</p>
                <p><strong><MapPin className="inline mr-1" /> Source:</strong> {ride.source}</p>
                <p><strong><MapPin className="inline mr-1" /> Destination:</strong> {ride.destination}</p>
                <p><strong><Clock className="inline mr-1" /> Pickup Time:</strong> {ride.pickup_time}</p>
                <p><strong><Clock className="inline mr-1" /> Date:</strong> {new Date(ride.date).toLocaleDateString()}</p>
                <p><strong><Users className="inline mr-1" /> Seating:</strong> {ride.seating_capacity}</p>
                <p><strong><IndianRupee className="inline mr-1" /> Price:</strong> ₹ {ride.price}</p>
                <p><strong><IndianRupee className="inline mr-1" /> Contact:</strong> {ride.mobile_no} </p>
                <p><strong><Monitor className="inline mr-1" /> Status:</strong> {ride.status}</p>
                <p className="text-yellow-400 text-2xl">
                  <strong>Rating:</strong>
                  <span className="inline-block">&#9733;</span>
                  <span className="inline-block">&#9733;</span>
                  <span className="inline-block">&#9733;</span>
                  <span className="inline-block">&#9733;</span>
                  <span className="inline-block text-gray-300">&#9733;</span>
                </p>
              </div>
              <div className="flex justify-between mt-6 space-x-2">
                {ride.payment_status === 'unpaid' ?
                <button
                  onClick={() => handlePayment(ride.ride_id,ride.price)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Pay
                </button>
                :
                <button
      
                  className="bg-green-200 text-white px-4 py-2 rounded-lg hover:cursor-default"
                >
                  Paid
                </button>
                }
                <button
                  onClick={() => navigate(`/user/Track/${ride.driver_id}`)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Track Driver
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No upcoming rides found.</p>
      )}
    </div>
  );
};

export default UpcomingRides;
