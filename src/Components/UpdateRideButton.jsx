import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpdateRideButton = () => {
    const navigate = useNavigate();
  return (
    <button 
      className="
        fixed bottom-6 right-6 z-40
        flex items-center gap-2
        bg-blue-600 hover:bg-blue-700
        text-white font-semibold
        px-4 py-3 rounded-lg
        shadow-lg hover:shadow-xl
        transition-all duration-200
        transform hover:scale-105
      "
      onClick={() => {
        // Add your update logic here
        navigate("/driver/updateRide")
      }}
    >
      <RefreshCw className="h-5 w-5" />
      <span>Update Ride</span>
    </button>
  );
};

export default UpdateRideButton;