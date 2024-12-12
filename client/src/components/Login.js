// client/src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios'; // Make sure to install axios
import './Login.css'; // Ensure you have the CSS file for additional styling
import logoImage from '../assets/logo.png'; // Import your image here

const Login = ({ onLogin }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState(''); // New state for First Name
    const [lastName, setLastName] = useState(''); // New state for Last Name
    const [isUser, setIsUser] = useState(true);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password,
                isUser
            });

            // Handle successful login
            console.log('Login successful:', response.data);
            onLogin(response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        // Validate password match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/api/auth/signup', {
                email,
                password,
                firstName,
                lastName,
                isUser
            });

            // Handle successful signup
            console.log('Signup successful:', response.data);
            onLogin(response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="container-fluid d-flex">
            <div className="col-md-6 left-side bg-dark text-white" >
                <img src={logoImage} alt="Logo" className="logo-image" />
                <h1 className="project-heading">Welcome to Muse Locator</h1>
                <p className="filler-info">
                    A place to explore what's popping around you.
                </p>
            </div>
            <div className="col-md-6 d-flex justify-content-center align-items-center">
                <div className="card shadow p-4" style={{ width: '400px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    {!isSignup && (
                        <div className="d-flex justify-content-between mb-3">
                            <button
                                className={`btn ${isUser ? 'btn-dark' : 'btn-light'} flex-fill me-1`}
                                onClick={() => setIsUser(true)}
                            >
                                User
                            </button>
                            <div className="separator" style={{ width: '1px', backgroundColor: '#ccc', margin: '0 5px' }}></div>
                            <button
                                className={`btn ${!isUser ? 'btn-dark' : 'btn-light'} flex-fill ms-1`}
                                onClick={() => setIsUser(false)}
                            >
                                Admin
                            </button>
                        </div>
                    )}
                    <form onSubmit={isSignup ? handleSignup : handleLogin}>
                        {isSignup && (
                            <>
                                <h2 className="text-left" style={{padding: '10px 0px'}}>Be a part, sign up.</h2>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstName"
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        style={{ borderRadius: '5px', padding: '10px' }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        style={{ borderRadius: '5px', padding: '10px' }}
                                    />
                                </div>
                            </>
                        )}
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ borderRadius: '5px', padding: '10px' }}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ borderRadius: '5px', padding: '10px' }}
                            />
                        </div>
                        {isSignup && (
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    style={{ borderRadius: '5px', padding: '10px' }}
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="btn btn-primary w-100 mt-3"
                            style={{ borderRadius: '5px', padding: '10px' }}
                        >
                            {isSignup ? 'Sign Up' : 'Login'}
                        </button>
                        <div className="text-center mt-3 d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-link"
                                style={{ textDecoration: 'none' }}
                                onClick={() => setIsSignup(!isSignup)}
                            >
                                {isSignup ? 'Already Have an Account? Login' : 'Create an account'}
                            </button>
                            {!isSignup && (
                                <button
                                    type="button"
                                    className="btn btn-link"
                                    style={{ textDecoration: 'none' }}
                                    onClick={() => alert('Forgot password functionality not implemented yet.')}
                                >
                                    Forgot Password?
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;