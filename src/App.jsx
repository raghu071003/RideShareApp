import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import MapboxRouting from './Pages/Map';
import Payment from './Pages/Payment.jsx';
import CurrentRides from './Pages/CurrentRides.jsx';
import AutoCompleteInput from './Components/AutoComplete.jsx';
import Tracking from './Pages/Tracking.jsx';
import NavbarDriver from './Components/NavbarDriver.jsx';
import AdminNavbar from './Components/NavbarAdmin.jsx';
import DriverHome from './Pages/DriverHome.jsx';
import RideRequests from './Components/rideRequests.jsx';
import ContactPage from './Pages/Contact.jsx';
import Downloads from './Components/Download.jsx';
import AdminTracking from './Pages/AdminTracking.jsx';
import ReportPage from './Pages/Reports.jsx';


const ProtectedRoute = ({ children, isAuthenticated, redirectTo }) => {
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

const NavigationBar = ({ role }) => {
    switch (role) {
        case 'driver':
            return <NavbarDriver />;
        case 'admin':
            return <AdminNavbar />;
        default:
            return <Navbar />;
    }
};

function App() {
    const { loggedIn, role } = useAuth();

    return (
        <Router>
            <>
                
                <NavigationBar role={role} />
                <div className="flex justify-center items-center min-h-screen bg-gray-100">
                    <Routes>
                        {/* Public Routes */}
                        <Route 
                            path="/" 
                            element={role === 'driver' ? <DriverHome /> : <HomePage />} 
                        />
                        <Route path="/about" element={<About />} />
                        <Route path="/rider/features" element={<FeaturesPage />} />
                        <Route path="/auto" element={<AutoCompleteInput />} />
                        <Route path="/load" element={<Loading />} />

                        {/* Authentication Routes */}
                        <Route 
                            path="/rider-login" 
                            element={loggedIn ? <Navigate to="/bookride" /> : <RiderLogin />} 
                        />
                        <Route 
                            path="/driver-login" 
                            element={loggedIn ? <Navigate to="/driver/" /> : <DriverLogin />} 
                        />
                        <Route 
                            path="/admin-login" 
                            element={loggedIn ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} 
                        />

                        {/* Protected Rider Routes */}
                        <Route
                            path="/bookride"
                            element={
                                <ProtectedRoute isAuthenticated={loggedIn} redirectTo="/rider-login">
                                    <BookRide />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/payment/:ride_id/:price"
                            element={
                                <ProtectedRoute isAuthenticated={loggedIn} redirectTo="/rider-login">
                                    <Payment />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/user/Track/:driverId"
                            element={
                                <ProtectedRoute isAuthenticated={loggedIn} redirectTo="/rider-login">
                                    <Tracking />
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected Driver Routes */}
                        <Route
                            path="/driver/dashboard"
                            element={
                                <ProtectedRoute isAuthenticated={loggedIn} redirectTo="/driver-login">
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/driver/updateRide"
                            element={
                                <ProtectedRoute isAuthenticated={loggedIn} redirectTo="/driver-login">
                                    <UpdateRide />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/driver/rideRequests"
                            element={
                                <ProtectedRoute isAuthenticated={loggedIn} redirectTo="/driver-login">
                                    <RideRequests />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/driver/currentRides"
                            element={
                                <ProtectedRoute isAuthenticated={loggedIn} redirectTo="/driver-login">
                                    <CurrentRides />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/driver/"
                            element={
                                <ProtectedRoute isAuthenticated={loggedIn} redirectTo="/driver-login">
                                    <DriverHome />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/driver/home"
                            element={
                                <ProtectedRoute isAuthenticated={loggedIn} redirectTo="/driver-login">
                                    <DriverHome />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute isAuthenticated={loggedIn && role === 'admin'} redirectTo="/admin-login">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/downloads"
                            element={
                                <ProtectedRoute isAuthenticated={loggedIn && role === 'admin'} redirectTo="/admin-login">
                                    <Downloads />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/tracking"
                            element={
                                <ProtectedRoute isAuthenticated={loggedIn && role === 'admin'} redirectTo="/admin-login">
                                    <AdminTracking />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/tracking/:driverId"
                            element={
                                <ProtectedRoute isAuthenticated={loggedIn && role === 'admin'} redirectTo="/admin-login">
                                    <Tracking />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/reports"
                            element={
                                <ProtectedRoute isAuthenticated={loggedIn && role === 'admin'} redirectTo="/admin-login">
                                    <ReportPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route path='/contact' element={<ContactPage />} />

                        <Route path="/map" element={<MapboxRouting />} />
                    </Routes>
                </div>
            </>
        </Router>
    );
}

export default App;
