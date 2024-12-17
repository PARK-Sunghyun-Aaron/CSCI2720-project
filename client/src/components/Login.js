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

    // New state for password validation
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecial: false
    });

    // Add these new states at the beginning of your Login component
    const [showPasswordHints, setShowPasswordHints] = useState(false);

    // Password validation function
    const validatePassword = (password) => {
        setPasswordValidation({
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    };

    // Handle password change
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (isSignup && showPasswordHints) {
            validatePassword(newPassword);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password,
                isUser
            });

            // Store both token and email
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userEmail', response.data.user.email);
            onLogin(response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        // Check if all password requirements are met
        const isPasswordValid = Object.values(passwordValidation).every(Boolean);
        if (!isPasswordValid) {
            setError('Please ensure your password meets all requirements');
            setShowPasswordHints(true); // Show hints only after invalid attempt
            validatePassword(password); // Validate current password to show correct indicators
            return;
        }

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
            localStorage.setItem('userEmail', response.data.user.email);
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
                                onChange={handlePasswordChange}
                                required
                                style={{ borderRadius: '5px', padding: '10px' }}
                            />
                            
                            {/* Password requirements checklist (only show after invalid attempt) */}
                            {isSignup && showPasswordHints && (
                                <div className="password-requirements mt-2" 
                                    style={{ 
                                        fontSize: '0.8rem',
                                        transition: 'all 0.3s ease'
                                    }}>
                                    <p className="mb-1">Password must contain:</p>
                                    <ul className="list-unstyled">
                                        <li style={{ color: passwordValidation.minLength ? 'green' : 'red' }}>
                                            <i className={`fas ${passwordValidation.minLength ? 'fa-check' : 'fa-times'}`}></i>
                                            {' '}At least 8 characters
                                        </li>
                                        <li style={{ color: passwordValidation.hasUpperCase ? 'green' : 'red' }}>
                                            <i className={`fas ${passwordValidation.hasUpperCase ? 'fa-check' : 'fa-times'}`}></i>
                                            {' '}One uppercase letter
                                        </li>
                                        <li style={{ color: passwordValidation.hasLowerCase ? 'green' : 'red' }}>
                                            <i className={`fas ${passwordValidation.hasLowerCase ? 'fa-check' : 'fa-times'}`}></i>
                                            {' '}One lowercase letter
                                        </li>
                                        <li style={{ color: passwordValidation.hasNumber ? 'green' : 'red' }}>
                                            <i className={`fas ${passwordValidation.hasNumber ? 'fa-check' : 'fa-times'}`}></i>
                                            {' '}One number
                                        </li>
                                        <li style={{ color: passwordValidation.hasSpecial ? 'green' : 'red' }}>
                                            <i className={`fas ${passwordValidation.hasSpecial ? 'fa-check' : 'fa-times'}`}></i>
                                            {' '}One special character
                                        </li>
                                    </ul>
                                </div>
                            )}
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