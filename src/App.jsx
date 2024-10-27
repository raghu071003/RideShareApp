// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RiderLogin from './Pages/RiderLogin';
import DriverLogin from './Pages/DriverLogin';
import AdminLogin from './Pages/AdminLogin';
import HomePage from './Pages/HomePage';
import Navbar from './Components/Navbar';
import BookRide from './Pages/BookRide';
import UpdateRide from './Pages/UpdateRide';
import Dashboard from './Pages/DriverDashboard';
import { useAuth } from './Context/AuthContext';
import Loading from './Components/Loading';
import AdminDashboard from './Pages/AdminDashBoard';

function App() {
    const { loggedIn } = useAuth();

    return (
        <Router>
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen bg-gray-100">
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path="/rider-login" element={ <RiderLogin />} />
                        <Route path="/driver-login" element={loggedIn ? <Dashboard/> :<DriverLogin />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path='/bookride' element={loggedIn ? <BookRide /> : <RiderLogin />} />
                        <Route path='/driver/updateRide' element={loggedIn ? <UpdateRide /> : <DriverLogin />} />
                        <Route path='/driver/dashboard' element={loggedIn ? <Dashboard /> : <DriverLogin />} />
                        <Route path='/load' element={<Loading />} />
                        <Route path='/admin/dashboard' element={<AdminDashboard />} />
                    </Routes>
                </div>
            </>
        </Router>
    );
}

export default App;
