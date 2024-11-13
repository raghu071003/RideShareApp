import React, { useEffect, useState } from 'react';
import { User, MapPin, Clock, Users, IndianRupee, Monitor } from 'lucide-react';
import axios from 'axios';
import RatingComponent from './RatingComponent';

const CompletedRides = () => {
  const [loadingRides, setLoadingRides] = useState(true);
  const [completedRides, setCompletedRides] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // For handling modal visibility
  const [reportDetails, setReportDetails] = useState(""); // For storing report details
  const [selectedRide, setSelectedRide] = useState(null); // For storing the selected ride

  useEffect(() => {
    const fetchCompletedRides = async () => {
      try {
        const response = await axios.get('http://localhost:8090/api/v1/user/completedRides', { withCredentials: true });
        setCompletedRides(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching completed rides:', error);
      } finally {
        setLoadingRides(false);
      }
    };

    fetchCompletedRides();
    
  }, []);

  // Handle reporting a driver
  const handleReportDriver = async () => {
    try {
      const response = await axios.post('http://localhost:8090/api/v1/user/reportDriver', {
        rideId: selectedRide.ride_id,
        driverId: selectedRide.driver_id,
        driverName: selectedRide.driver_name, // Assuming driver name is available in the ride data
        driverContact: selectedRide.mobile_no,
        reportDetails: reportDetails,
      }, { withCredentials: true });

      if (response.data.success) {
        alert('Report submitted successfully');
        setIsModalOpen(false); // Close the modal
        setReportDetails(""); // Clear report details
      } else {
        alert('Failed to submit the report');
      }
    } catch (error) {
      console.error('Error reporting driver:', error);
      alert('Error submitting the report');
    }
  };

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
                  <strong><User className="inline mr-1" /> Driver ID:</strong> {ride.driver_id}
                </p>
                <p>
                  <strong><User className="inline mr-1" /> Driver Name:</strong> {ride.driver_name}
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
                <RatingComponent ride={ride} />

                <button
                  onClick={() => {
                    setSelectedRide(ride); // Store selected ride details
                    setIsModalOpen(true); // Open the report modal
                  }}
                  className="absolute top-2 right-4 mt-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-400"
                >
                  Report Driver
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No completed rides found.</p>
      )}

      {/* Modal for reporting driver */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-center">Report Driver</h3>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              className="w-full h-32 p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your report details here..."
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleReportDriver}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-400"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedRides;
