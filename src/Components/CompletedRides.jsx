import React, { useEffect, useState } from 'react';
import { User, MapPin, Clock, Users, IndianRupee, Monitor } from 'lucide-react';
import axios from 'axios';
import RatingComponent from './RatingComponent';

const CompletedRides = () => {
  const [loadingRides, setLoadingRides] = useState(true);
  const [completedRides, setCompletedRides] = useState([]);
  

  useEffect(() => {
    const fetchCompletedRides = async () => {
      try {
        const response = await axios.get('http://localhost:8090/api/v1/user/completedRides', { withCredentials: true });
        setCompletedRides(response.data);
      } catch (error) {
        console.error('Error fetching completed rides:', error);
      } finally {
        setLoadingRides(false);
      }
    };

    fetchCompletedRides();
  }, []);

  

  return (
    <div className="mt-10">
      <h3 className="text-3xl font-bold mb-6 text-center text-blue-700">Completed Rides</h3>
      {loadingRides ? (
        <p className="text-center text-blue-600 text-lg">Loading completed rides...</p>
      ) : completedRides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {completedRides.map((ride) => (
            <div
              key={ride.ride_id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-6 transition-transform transform hover:-translate-y-2 hover:shadow-lg"
            >
              <h4 className="text-xl font-semibold mb-3 text-blue-700">
                <User className="inline mr-2" /> Ride ID: {ride.ride_id}
              </h4>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong><User className="inline mr-1" /> Rider ID:</strong> {ride.rider_id}
                </p>
                <p>
                  <strong><MapPin className="inline mr-1" /> Source:</strong> {ride.source}
                </p>
                <p>
                  <strong><MapPin className="inline mr-1" /> Destination:</strong> {ride.destination}
                </p>
                <p>
                  <strong><Clock className="inline mr-1" /> Pickup Time:</strong> {ride.pickup_time}
                </p>
                <p>
                  <strong><Clock className="inline mr-1" /> Date:</strong> {new Date(ride.date).toLocaleDateString()}
                </p>
                <p>
                  <strong><Users className="inline mr-1" /> Seating:</strong> {ride.seating_capacity}
                </p>
                <p>
                  <strong><IndianRupee className="inline mr-1" /> Price: ₹</strong> {ride.price}
                </p>
                <p>
                  <strong><Monitor className="inline mr-1" /> Status:</strong> {ride.status}
                </p>
                <RatingComponent ride={ride}/>
              </div>
              
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No completed rides found.</p>
      )}
    </div>
  );
};

export default CompletedRides;
