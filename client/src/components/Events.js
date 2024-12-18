import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Toast from './common/Toast';


const Events = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locations, setLocations] = useState({});
    const [message, setMessage] = useState('');
    
    const userEmail = localStorage.getItem('userEmail');

    const handleMessage = (msg) => {
        setMessage(msg);
        if (msg) {
            setTimeout(() => setMessage(''), 2000);
        }
    };

    // Fetch events and locations
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsResponse, locationsResponse] = await Promise.all([
                    axios.get('http://localhost:5001/api/events/listAllEvents'),
                    axios.get('http://localhost:5001/api/locations/listAllLocations')
                ]);

                setEvents(eventsResponse.data);
                
                // Create a map of venue IDs to location names
                const locationMap = {};
                locationsResponse.data.forEach(loc => {
                    locationMap[loc.venueid] = loc.location;
                });
                setLocations(locationMap);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Filter events based on search term
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (locations[event.venue] || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle booking
    const handleBooking = async (eventId) => {
        try {
            const response = await axios.post('http://localhost:5001/api/bookings/create', {
                eventId,
                userEmail
            });

            if (response.status === 201) {
                handleMessage('Event booked successfully.');
                setTimeout(() => handleMessage(''), 2000);
            }
        } catch (error) {
            console.error('Error booking event:', error);
            handleMessage('Error booking event.');
            setTimeout(() => handleMessage(''), 2000);
        }
    };

    return (
        <main className="container mt-4" style={{ paddingTop: '70px' }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Upcoming Events</h1>
                    </div>
                    <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                        <input 
                            type="text" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            placeholder="Search events..." 
                            style={{ 
                                border: 'none', 
                                outline: 'none', 
                                borderBottom: '1px solid #ccc', 
                                padding: '5px',
                                width: '200px'
                            }} 
                        />
                    </div>
                </div>

                <div style={{ marginTop: '20px' }} />

                <table className="table">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Venue</th>
                            <th>Date</th>
                            <th>Duration</th>
                            <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map(event => (
                            <tr key={event.eventid}>
                                <td>
                                    <Link 
                                        to={`/events/${event.eventid}`}
                                        className="text-decoration-none text-primary"
                                    >
                                        {event.title}
                                    </Link>
                                </td>
                                <td>{locations[event.venue] || event.venue}</td>
                                <td>{event.date}</td>
                                <td>{event.duration}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <button 
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => handleBooking(event.eventid)}
                                    >
                                        Book Now
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Toast 
                message={message} 
                onClose={() => setMessage('')}
            />
        </main>
    );
};

export default Events; 