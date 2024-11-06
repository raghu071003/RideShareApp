import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const Payment = () => {
  const { ride_id,price } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null); // Track selected payment method

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }
  
    try {
      // Make an API call to update payment status to "paid"
      const response = await axios.post(`http://localhost:8090/api/v1/user//updatePayment/${ride_id}`, {
        paymentMethod: selectedMethod, // Send the selected payment method to the server (optional)
      },{withCredentials:true});
  
      if (response.status === 200) {
        alert(`Payment successful via ${selectedMethod} for ride ID: ${ride_id}`);
        navigate('/'); // Navigate back to the home page or another desired page after payment
      } else {
        alert('Payment update failed. Please try again.');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('An error occurred during payment. Please try again later.');
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Payment Page</h2>
        <p className="text-lg mb-6 text-gray-700">
          Ride ID: <span className="font-semibold">{ride_id}</span>
        </p>
        <p className="text-lg mb-8 text-gray-600">
          Total Amount: <span className="font-semibold">₹{price}</span> {/* Replace with actual price if needed */}
        </p>

        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Select Payment Method:</h3>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => setSelectedMethod('Card')}
              className={`p-4 rounded-lg border ${selectedMethod === 'Card' ? 'bg-blue-100 border-blue-500' : 'border-gray-200'} transition`}
            >
              💳 Card
            </button>
            <button
              onClick={() => setSelectedMethod('UPI')}
              className={`p-4 rounded-lg border ${selectedMethod === 'UPI' ? 'bg-blue-100 border-blue-500' : 'border-gray-200'} transition`}
            >
              📲 UPI
            </button>
            <button
              onClick={() => setSelectedMethod('Cash')}
              className={`p-4 rounded-lg border ${selectedMethod === 'Cash' ? 'bg-blue-100 border-blue-500' : 'border-gray-200'} transition`}
            >
              💵 Cash
            </button>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Payment;
