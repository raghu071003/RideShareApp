import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">About RideShare</h1>
            <p className="text-gray-700 mb-4">
                Welcome to RideShare, your go-to application for efficient and convenient carpooling! 
                Our mission is to connect commuters within the Hexaware community, providing a seamless and sustainable 
                way to travel together while reducing commuting costs and promoting eco-friendly practices.
            </p>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">Our Features</h2>
            <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>User Authentication: Employees log in using their corporate credentials, ensuring that only verified Hexaware employees can access the application.</li>
                <li>AI-Powered Ride Matching: Advanced AI algorithms match riders and drivers based on route similarity, travel schedules, and user preferences.</li>
                <li>Flexible Ride Scheduling: Employees can schedule rides in advance or find immediate matches for their travel needs.</li>
                <li>Cashless Transactions: Secure, cashless payments with automatic fare calculation and cost splitting among ride participants.</li>
                <li>Real-Time Notifications: Users receive real-time notifications for ride confirmations, cancellations, and updates.</li>
            </ul>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">Why Choose Us?</h2>
            <p className="text-gray-700 mb-4">
                At RideShare, we are committed to making commuting safer, more affordable, and environmentally friendly. 
                By leveraging technology and fostering community connections, we aim to enhance your daily travel experience.
            </p>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">Get Involved!</h2>
            <p className="text-gray-700 mb-4">
                Join us in our mission to transform the way we commute. Download the RideShare app today and start sharing rides with your colleagues!
            </p>
        </div>
    );
}

export default About;
