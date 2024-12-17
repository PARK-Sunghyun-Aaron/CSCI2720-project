import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Bookings.css';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const userEmail = localStorage.getItem('userEmail');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/bookings/user/${userEmail}`);
                setBookings(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setLoading(false);
            }
        };

        fetchBookings();
    }, [userEmail]);

    const handleCancelBooking = async (bookingId) => {
        try {
            await axios.put(`http://localhost:5001/api/bookings/cancel/${bookingId}`);
            setBookings(bookings.filter(booking => booking._id !== bookingId));
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Failed to cancel booking');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <main className="container mt-4" style={{ paddingTop: '70px' }}>
            <h1 className="mb-4">My Bookings</h1>
            <div className="row">
                {bookings.map(booking => (
                    <div key={booking._id} className="col-md-4 mb-4">
                        <div className="booking-card" onClick={() => navigate(`/event/${booking.eventId}`)}>
                            <div className="booking-card-header">
                                <h5>{booking.event.title}</h5>
                                <span className="booking-date">
                                    Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="booking-card-body">
                                <p><strong>Event Date:</strong> {booking.event.date}</p>
                                <p><strong>Duration:</strong> {booking.event.duration}</p>
                                <p><strong>Presenter:</strong> {booking.event.pre}</p>
                            </div>
                            <div className="booking-card-footer">
                                <button 
                                    className="btn btn-outline-danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelBooking(booking._id);
                                    }}
                                >
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {bookings.length === 0 && (
                    <div className="col-12 text-center">
                        <p>No bookings found</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Bookings; 