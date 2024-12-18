/*
I/We declare that the lab work here submitted is original
except for source material explicitly acknowledged,
and that the same or closely related material has not been
previously submitted for another course.
I/We also acknowledge that I/We am aware of University policy and
regulations on honesty in academic work, and of the disciplinary
guidelines and procedures applicable to breaches of such
policy and regulations, as contained in the website.
University Guideline on Academic Honesty:
https://www.cuhk.edu.hk/policy/academichonesty/
Student Name : LIN Yi
Student ID : 1155232784
Student Name : MANAV Suryansh
Student ID : 1155156662
Student Name : MUI Ka Shun
Student ID : 1155194765
Student Name : PARK Sunghyun
Student ID : 1155167933
Student Name : RAO Penghao
Student ID : 1155191490
Class/Section : CSCI2720
Date : 2024-12-04
*/
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
                const bookingsWithEventDetails = await Promise.all(response.data.map(async (booking) => {
                    const eventResponse = await axios.get(`http://localhost:5001/api/events/loadEvent/${booking.eventId}`);
                    return { ...booking, event: eventResponse.data }; // Merge booking with event details
                }));
                setBookings(bookingsWithEventDetails);
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
