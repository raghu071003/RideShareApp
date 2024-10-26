import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RiderLogin from './Pages/RiderLogin';
import DriverLogin from './Pages/DriverLogin';
import AdminLogin from './Pages/AdminLogin';
import HomePage from './Pages/HomePage';
import Navbar from './Components/Navbar';
import BookRide from './Pages/BookRide';

function App() {
    return (
        <Router>
          <>
          <Navbar />
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path="/rider-login" element={<RiderLogin />} />
                    <Route path="/driver-login" element={<DriverLogin />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path='/bookride' element={<BookRide />} />
                </Routes>
            </div>
          </>
            
        </Router>
    );
}

export default App;
