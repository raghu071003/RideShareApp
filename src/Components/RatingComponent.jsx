import React, { useState } from 'react';

const RatingComponent = ({ onRatingSelect }) => {
    const [rating, setRating] = useState(0);

    const handleRatingClick = (newRating) => {
        setRating(newRating);
        if (onRatingSelect) {
            onRatingSelect(newRating);
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
        </div>
    );
};

export default RatingComponent;
