import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed top-4 right-4 z-50
        max-w-md p-4 border rounded-lg shadow-lg bg-white
        transition-all duration-300 ease-in-out
        ${isVisible && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
        hover:bg-slate-50 cursor-pointer
      `}
    >
      <div className="flex items-start gap-3">
        <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            Welcome back!
          </h3>
          <p className="text-blue-600 hover:text-blue-700" onClick={()=>navigate("/driver/currentRides")}>
            Click here to see your rides
          </p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Notification;