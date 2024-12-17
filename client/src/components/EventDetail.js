import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const userEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const eventResponse = await axios.get(`http://localhost:5001/api/events/loadEvent/${id}`);
                setEvent(eventResponse.data);
                
                // Fetch venue details
                const venueResponse = await axios.get(`http://localhost:5001/api/locations/loadLocation/${eventResponse.data.venue}`);
                setVenue(venueResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event details:', error);
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    useEffect(() => {
        if (venue) {
            // Load Google Maps script
            const googleMapsScript = document.createElement("script");
            googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC6SJqInCt0heffya0W622QSkiaoXDHKFA`;
            googleMapsScript.async = true;
            googleMapsScript.onload = initMap;
            document.body.appendChild(googleMapsScript);

            function initMap() {
                const map = new window.google.maps.Map(document.getElementById("eventMap"), {
                    center: { 
                        lat: parseFloat(venue.latitude), 
                        lng: parseFloat(venue.longitude) 
                    },
                    zoom: 15,
                });

                new window.google.maps.Marker({
                    position: { 
                        lat: parseFloat(venue.latitude), 
                        lng: parseFloat(venue.longitude) 
                    },
                    map: map,
                    title: venue.location
                });
            }

            return () => {
                document.body.removeChild(googleMapsScript);
            };
        }
    }, [venue]);

    const handleBooking = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/bookings/create', {
                eventId: id,
                userEmail
            });

            if (response.status === 201) {
                alert('Event booked successfully!');
            }
        } catch (error) {
            console.error('Error booking event:', error);
            alert('Failed to book event. Please try again.');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (!event || !venue) {
        return <div className="error-message">Event not found</div>;
    }

    return (
        <main className="container mt-4" style={{ paddingTop: '70px' }}>
            <div className="event-detail">
                {/* Event Details Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h2 className="card-title">{event.title}</h2>
                        <div className="event-info mt-3">
                            <p><strong>Date:</strong> {event.date}</p>
                            <p><strong>Duration:</strong> {event.duration}</p>
                            <p><strong>Venue:</strong> {venue.location}</p>
                            <p><strong>Presenter:</strong> {event.pre}</p>
                            <p><strong>Description:</strong> {event.descre}</p>
                            <button 
                                className="btn btn-primary mt-3"
                                onClick={handleBooking}
                            >
                                Book This Event
                            </button>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h3 className="card-title">Event Location</h3>
                        <div 
                            id="eventMap" 
                            style={{
                                height: "400px",
                                borderRadius: "8px",
                                marginTop: "1rem"
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EventDetail; 