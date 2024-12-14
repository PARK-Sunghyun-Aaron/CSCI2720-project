// client/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import EventsTable from './components/EventsTable';
import Login from './components/Login';
import Locator from './components/Locator';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

const App = () => {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('light');

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
    };

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <Router>
            <div className={`App ${theme}`}>     {/*Here, pay attention to change the className*/}
                
                {/* Add the Theme toggle button */} 
                <button className="theme-button" onClick={toggleTheme}>
                    Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
                </button>

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

                    {/* Protected Routes */}
                    <Route 
                        path="/user-dashboard" 
                        element={user && user.role === 'user' ? <UserDashboard user={user} /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/admin-dashboard" 
                        element={user && user.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />} 
                    />

                    {/* Original Protected Routes */}
                    <Route 
                        path="/" 
                        element={user ? <EventsTable /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/locator" 
                        element={user ? <Locator /> : <Navigate to="/login" />} 
                    />
                </Routes>
                
                {user && <Footer />}
            </div>
        </Router>
    );
};

export default App;