// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Locations from './components/Locations';
import LocationDetail from './components/LocationDetail';
import Login from './components/Login';
import Locator from './components/Locator';
import AdminDashboard from './components/AdminDashboard';
import Favorites from './components/Favorites';
import Events from './components/Events';
import EventDetail from './components/EventDetail';
import Bookings from './components/Bookings';
import './App.css';

const App = () => {
    const [user, setUser] = useState(null);
    const [filteredLocations, setFilteredLocations] = useState([]);

    // Check for logged-in user when app loads
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');
        
        if (token && userEmail) {
            fetch(`http://localhost:5001/api/users/loadUser/${userEmail}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Token invalid');
                    return res.json();
                })
                .then(userData => {
                    if (userData) {
                        setUser(userData);
                    }
                })
                .catch(err => {
                    console.error('Error loading user:', err);
                    // Clear both token and email on error
                    localStorage.removeItem('token');
                    localStorage.removeItem('userEmail');
                    setUser(null);
                });
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('userEmail', userData.email);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
    };

    return (
        <Router>
            <div className="App">
                {/* Conditional Header rendering */}
                {user && (
                    <Header 
                        isAuthenticated={!!user} 
                        userName={`${user.firstName}`} 
                        onLogout={handleLogout} 
                        isAdmin={user.role === 'admin' ? true : false}
                    />
                )}
                
                <Routes>
                    {/* Login Route */}
                    <Route 
                        path="/login" 
                        element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/'} />} 
                    />

                    <Route 
                        path="/admin-dashboard" 
                        element={user && user.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />} 
                    />

                    {/* Original Protected Routes */}
                    <Route 
                        path="/" 
                        element={user ? <Locations filteredLocations={filteredLocations} setFilteredLocations={setFilteredLocations}/> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/locator" 
                        element={user ? <Locator filteredLocations={filteredLocations}/> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/favorites" 
                        element={user ? <Favorites /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/location/:locName" 
                        element={<LocationDetail />} />
                    <Route 
                        path="/events" 
                        element={user ? <Events /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/events/:id" 
                        element={user ? <EventDetail /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/bookings" 
                        element={user ? <Bookings /> : <Navigate to="/login" />} 
                    />
                </Routes>
                
                {user && <Footer />}
            </div>
        </Router>
    );
};

export default App;