import React from 'react';
import { DollarSign, Shield, Car, IndianRupee, Map, Users, Clock } from 'lucide-react';
import ChatBot from '../Components/Chatbot';


function HomePage() {
    const fadeIn = (element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
        element.style.transition = 'opacity 0.5s, transform 0.5s';
      
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
      };
      
      const fadeInUp = (element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s, transform 0.5s';
      
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
      };
      
      const zoomIn = (element) => {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.5)';
        element.style.transition = 'opacity 0.5s, transform 0.5s';
      
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'scale(1)';
        });
      };
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <ChatBot />
    <section
      className="bg-blue-600 text-white py-24 text-center w-full"
      data-aos={fadeIn}
      data-aos-duration="800"
    >
      <div className="px-6">
        <h2 className="text-5xl font-bold mb-4">Get a Ride in Minutes</h2>
        <p className="mb-8 text-lg">
          Fast, affordable, and safe rides at your fingertips. Whether you're
          commuting or exploring, RideShare has got you covered.
        </p>
        <a
          href="/rider-login"
          className="bg-white text-blue-600 py-3 px-8 rounded-full font-bold hover:bg-gray-100 transition duration-300"
        >
          Start Riding
        </a>
      </div>
    </section>

    <section
      id="features"
      className="py-20 w-full"
      data-aos={fadeInUp}
      data-aos-duration="800"
    >
      <div className="px-6 text-center">
        <h3 className="text-4xl font-bold mb-12 text-gray-800">
          Why Choose RideShare?
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-80 transition transform hover:scale-105"
            data-aos={zoomIn}
            data-aos-duration="600"
          >
            <IndianRupee className="w-10 h-10 mx-auto mb-4 text-blue-600" />
            <h4 className="text-xl font-bold mb-4">Affordable Rides</h4>
            <p>
              Competitive pricing and a variety of ride options to suit your
              needs.
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-80 transition transform hover:scale-105"
            data-aos={zoomIn}
            data-aos-duration="600"
            data-aos-delay="200"
          >
            <Shield className="w-10 h-10 mx-auto mb-4 text-blue-600" />
            <h4 className="text-xl font-bold mb-4">Safe and Secure</h4>
            <p>
              Top-rated drivers and safety measures to ensure a secure
              experience.
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-80 transition transform hover:scale-105"
            data-aos={zoomIn}
            data-aos-duration="600"
            data-aos-delay="400"
          >
            <Car className="w-10 h-10 mx-auto mb-4 text-blue-600" />
            <h4 className="text-xl font-bold mb-4">Fast Pickup</h4>
            <p>
              Get picked up quickly with our wide network of available drivers.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section
      id="how-it-works"
      className="py-20 bg-gray-100 w-full"
      data-aos={fadeInUp}
      data-aos-duration="800"
    >
      <div className="px-6 text-center">
        <h3 className="text-4xl font-bold mb-12 text-gray-800">How It Works</h3>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 transition transform hover:scale-105">
            <Map className="w-10 h-10 mx-auto mb-4 text-blue-600" />
            <h4 className="text-xl font-bold mb-4">Request a Ride</h4>
            <p>
              Use the app to request a ride from your current location. Our
              drivers will be notified and accept your request.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 transition transform hover:scale-105">
            <Users className="w-10 h-10 mx-auto mb-4 text-blue-600" />
            <h4 className="text-xl font-bold mb-4">Get Matched</h4>
            <p>
              Our smart algorithm will match you with the nearest available
              driver based on your location and preferences.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 transition transform hover:scale-105">
            <Clock className="w-10 h-10 mx-auto mb-4 text-blue-600" />
            <h4 className="text-xl font-bold mb-4">Arrive on Time</h4>
            <p>
              Your driver will arrive promptly to take you to your destination.
              Sit back and enjoy the ride!
            </p>
          </div>
        </div>
      </div>
    </section>

    <section
      id="contact"
      className="bg-blue-600 text-white py-24 text-center w-full"
      data-aos={fadeIn}
      data-aos-duration="800"
    >
      <div className="px-6">
        <h4 className="text-4xl font-bold mb-6">Ready to Ride?</h4>
        <p className="mb-8 text-lg">
          Sign up now and start your journey with RideShare today!
        </p>
        <a
          href="/rider-login"
          className="bg-white text-blue-600 py-3 px-8 rounded-full font-bold hover:bg-gray-100 transition duration-300"
        >
          Get Started
        </a>
      </div>
    </section>

    <footer className="bg-gray-800 text-white py-6 w-full">
      <div className="px-6 text-center">
        <p>&copy; 2024 RideShare. All rights reserved.</p>
      </div>
    </footer>
  </div>
);
}

export default HomePage;