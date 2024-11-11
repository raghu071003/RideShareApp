import React, { useState } from 'react';
import axios from 'axios';
const RatingComponent = ({ onRatingSelect,ride }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState({});
    const handleRatingClick = (newRating) => {
        setRating(newRating);
        if (onRatingSelect) {
            onRatingSelect(newRating);
        }
    };
    const handleFeedbackChange = (rideId, value) => {
        setFeedback((prevFeedback) => ({
          ...prevFeedback,
          [rideId]: value,
        }));
      };
    
      const submitFeedback = async (rideId) => {
        try {
          const response = await axios.post(
            `http://localhost:8090/api/v1/user/feedback`, 
            { rideId, feedback: feedback[rideId],rating }, 
            { withCredentials: true }
          );
          console.log('Feedback submitted:', response.data);
          alert('Feedback submitted successfully!');
        } catch (error) {
          console.error('Error submitting feedback:', error);
        }
      };

    return (
        <div className="text-yellow-400 text-2xl">
            <strong className='text-gray-600'>Rating:</strong>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`inline-block cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => handleRatingClick(star)}
                >
                    &#9733;
                </span>
            ))}
            <div className="flex justify-between mt-6 space-x-2">
                <input
                  type="text"
                  placeholder="Write your feedback"
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={feedback[ride.ride_id] || ''}
                  onChange={(e) => handleFeedbackChange(ride.ride_id, e.target.value)}
                />
                <button
                  onClick={() => submitFeedback(ride.ride_id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Give Feedback
                </button>
              </div>
        </div>
    );
};

export default RatingComponent;
