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
import AdminDashboard from './Pages/AdminDashBoard.jsx';
import FeaturesPage from './Pages/Features';
import About from './Pages/About';
// import Map from './Pages/Map';
import MapboxRouting from './Pages/Map';
import Payment from './Pages/Payment.jsx';
import CurrentRides from './Pages/CurrentRides.jsx';
import AutoCompleteInput from './Components/AutoComplete.jsx';

function App() {
    const { loggedIn,role } = useAuth();

    return (
        <Router>
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen bg-gray-100">
                    <Routes>
                        <Route path='/' element={role === 'driver' ? <Dashboard/> :<HomePage />} />
                        <Route path="/rider-login" element={ <RiderLogin />} />
                        <Route path="/driver-login" element={loggedIn ? <Dashboard/> :<DriverLogin />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path='/bookride' element={loggedIn ? <BookRide /> : <RiderLogin />} />
                        <Route path='/driver/updateRide' element={loggedIn ? <UpdateRide /> : <DriverLogin />} />
                        <Route path='/driver/dashboard' element={loggedIn ? <Dashboard /> : <DriverLogin />} />
                        <Route path='/load' element={<Loading />} />
                        <Route path='/admin/dashboard' element={<AdminDashboard />} />
                        <Route path='/rider/features' element={<FeaturesPage />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/map' element={<MapboxRouting />} />
                        <Route path="/payment/:ride_id" element={<Payment />} />
                        <Route path="/driver/currentRides" element={<CurrentRides />} />
                        <Route path="/auto" element={<AutoCompleteInput />} /> 
                    </Routes>
                </div>
            </>
        </Router>
    );
}

export default App;
