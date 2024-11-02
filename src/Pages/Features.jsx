// src/FeaturesPage.js

import React from 'react';
import { Lock, Car, Calendar, CreditCard, Bell, } from 'lucide-react'; // Importing icons

const features = [
  {
    title: 'User Authentication',
    description: 'Employees will log in using their corporate credentials, ensuring that only verified Hexaware employees can access the application.',
    icon: <Lock className="w-6 h-6 text-blue-600" />,
  },
  {
    title: 'AI-Powered Ride Matching',
    description: 'The application uses advanced AI algorithms to match riders and drivers based on factors such as route similarity, travel schedules, and user preferences, optimizing the carpooling experience.',
    icon: <Car className="w-6 h-6 text-blue-600" />,
  },
  {
    title: 'Flexible Ride Scheduling',
    description: 'Employees can schedule rides in advance or find immediate matches for their travel needs.',
    icon: <Calendar className="w-6 h-6 text-blue-600" />,
  },
  {
    title: 'Cashless Transactions',
    description: 'RideShare application supports secure, cashless payments, with automatic fare calculation and cost splitting among ride participants.',
    icon: <CreditCard className="w-6 h-6 text-blue-600" />,
  },
  {
    title: 'Real-Time Notifications',
    description: 'Users receive real-time notifications for ride confirmations, cancellations, and updates.',
    icon: <Bell className="w-6 h-6 text-blue-600" />,
  },
];

const FeaturesPage = () => {
  return (
    <div className="container mx-auto my-10 p-5">
      <h1 className="text-3xl font-bold text-center mb-8">Features of the RideShare Application</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="feature-card border p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-start">
            <div className="mr-4">{feature.icon}</div>
            <div>
              <h2 className="text-xl font-semibold mb-3">{feature.title}</h2>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesPage;
