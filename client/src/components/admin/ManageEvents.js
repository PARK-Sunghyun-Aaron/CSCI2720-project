import React, { useState } from 'react';
import axios from 'axios';
import './AdminForms.css';

const ManageEvents = ({ setMessage }) => {
    const [expandedSection, setExpandedSection] = useState(null);
    
    // Event management state variables
    const [listEvents, setListEvents] = useState([]);
    const [locationName, setLocationName] = useState('');
    const [deleteEventId, setDeleteEventId] = useState('');
    const [foundEvent, setFoundEvent] = useState(null);
    const [loadEventId, setLoadEventId] = useState('');
    const [updateEventTitle, setUpdateEventTitle] = useState('');
    const [updateEventDate, setUpdateEventDate] = useState('');
    const [updateEventDuration, setUpdateEventDuration] = useState('');

    // New Event state variables
    const [newEventId, setNewEventId] = useState('');
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventVenue, setNewEventVenue] = useState('');
    const [newEventDate, setNewEventDate] = useState('');
    const [newEventDuration, setNewEventDuration] = useState('');
    const [newEventDescre, setNewEventDescre] = useState('');
    const [newEventPre, setNewEventPre] = useState('');

    // Event management functions
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/events/createEvent', {
                eventid: newEventId,
                title: newEventTitle,
                venue: newEventVenue,
                date: newEventDate,
                duration: newEventDuration,
                descre: newEventDescre,
                pre: newEventPre,
            });
            setMessage('Event created successfully');
            // Clear form fields after successful creation
            setNewEventId('');
            setNewEventTitle('');
            setNewEventVenue('');
            setNewEventDate('');
            setNewEventDuration('');
            setNewEventDescre('');
            setNewEventPre('');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error creating event');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleListEvents = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5001/api/events/listAllEvents');
            setListEvents(response.data);
            setMessage('Events listed successfully');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error listing events');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleLoadEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5001/api/events/loadEvent/${loadEventId}`);
            setFoundEvent(response.data);
            // Populate update fields
            setUpdateEventTitle(response.data.name);
            setUpdateEventDate(response.data.data);
            setUpdateEventDuration(response.data.duration);
            setMessage(`Event loaded: ${response.data.name}`);
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error loading event');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5001/api/events/updateEvent/${loadEventId}`, {
                name: updateEventTitle,
                quota: updateEventDate,
                loc: updateEventDuration,
            });
            setMessage('Event updated successfully');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error updating event');
            setTimeout(() => setMessage(''), 2000);
        }
    };
    
    const handleDeleteEvent = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:5001/api/events/deleteEvent/${deleteEventId}`);
            setMessage('Event deleted successfully');
            setDeleteEventId('');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error deleting event');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    return (
        <div className="tab-content w-100">
            <div className="admin-section">
                <div 
                    className="admin-section-header"
                    onClick={() => setExpandedSection(expandedSection === 'createEvent' ? null : 'createEvent')}
                >
                    <h3>
                        <i className="fas fa-calendar-plus me-2"></i>
                        Create New Event
                    </h3>
                    <i className={`fas fa-chevron-${expandedSection === 'createEvent' ? 'up' : 'down'}`}></i>
                </div>
                {expandedSection === 'createEvent' && (
                    <div className="admin-section-content">
                        <form onSubmit={handleCreateEvent} className="admin-form">
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="newEventId">Event Id</label>
                                    <input 
                                        type="number" 
                                        id="newEventId" 
                                        value={newEventId} 
                                        onChange={(e) => setNewEventId(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="form-col">
                                    <label htmlFor="newEventTitle">Event Title</label>
                                    <input 
                                        type="text" 
                                        id="newEventTitle" 
                                        value={newEventTitle} 
                                        onChange={(e) => setNewEventTitle(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="newEventVenue">Event Venue</label>
                                    <input 
                                        type="text" 
                                        id="newEventVenue" 
                                        value={newEventVenue} 
                                        onChange={(e) => setNewEventVenue(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="newEventDate">Event Date</label>
                                    <input 
                                        type="text" 
                                        id="newEventDate" 
                                        value={newEventDate} 
                                        onChange={(e) => setNewEventDate(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="form-col">
                                    <label htmlFor="newEventDuration">Event Duration</label>
                                    <input 
                                        type="text" 
                                        id="newEventDuration" 
                                        value={newEventDuration} 
                                        onChange={(e) => setNewEventDuration(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="newEventDescre">Event Description</label>
                                    <input 
                                        type="text" 
                                        id="newEventDescre" 
                                        value={newEventDescre} 
                                        onChange={(e) => setNewEventDescre(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="newEventPre">Event Pre</label>
                                    <input 
                                        type="text" 
                                        id="newEventPre" 
                                        value={newEventPre} 
                                        onChange={(e) => setNewEventPre(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-admin btn-admin-primary">
                                Create Event
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <div className="admin-section">
                <div 
                    className="admin-section-header"
                    onClick={() => setExpandedSection(expandedSection === 'listEvents' ? null : 'listEvents')}
                >
                    <h3>
                        <i className="fas fa-list me-2"></i>
                        List All Events
                    </h3>
                    <i className={`fas fa-chevron-${expandedSection === 'listEvents' ? 'up' : 'down'}`}></i>
                </div>
                {expandedSection === 'listEvents' && (
                    <div className="admin-section-content">
                        <form onSubmit={handleListEvents} className="admin-form">
                            <div className="data-list">
                                {listEvents.map((event) => (
                                    <div key={event.name} className="admin-card">
                                        <p><strong>Title:</strong> {event.title}</p>
                                        <p><strong>Venue:</strong> {event.venue}</p>
                                        <p><strong>Date:</strong> {event.date}</p>
                                        <p><strong>Duration:</strong> {event.duration}</p>
                                        <p><strong>Event ID:</strong> {event.eventID}</p>
                                    </div>
                                ))}
                            </div>
                            <button type="submit" className="btn-admin btn-admin-primary">
                                List Events
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <div className="admin-section">
                <div 
                    className="admin-section-header"
                    onClick={() => setExpandedSection(expandedSection === 'updateEvent' ? null : 'updateEvent')}
                >
                    <h3>
                        <i className="fas fa-edit me-2"></i>
                        Load and Update Event
                    </h3>
                    <i className={`fas fa-chevron-${expandedSection === 'updateEvent' ? 'up' : 'down'}`}></i>
                </div>
                {expandedSection === 'updateEvent' && (
                    <div className="admin-section-content">
                        <form onSubmit={handleLoadEvent} className="admin-form mb-4">
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="loadEventId">Event ID</label>
                                    <div className="d-flex gap-2">
                                        <input 
                                            type="text" 
                                            id="loadEventId" 
                                            value={loadEventId} 
                                            onChange={(e) => setLoadEventId(e.target.value)} 
                                            required 
                                            placeholder="Enter event ID"
                                            style={{ marginBottom: 0 }}
                                        />
                                        <button type="submit" className="btn-admin btn-admin-primary" style={{ minWidth: '125px' }}>
                                            Load Event
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <form onSubmit={handleUpdateEvent} className="admin-form">
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="updateEventTitle">Event Title</label>
                                    <input 
                                        type="text" 
                                        id="updateEventTitle" 
                                        value={updateEventTitle} 
                                        onChange={(e) => setUpdateEventTitle(e.target.value)} 
                                        required 
                                        disabled={!foundEvent}
                                        className={!foundEvent ? 'disabled-input' : ''}
                                        placeholder={foundEvent ? "Enter event title" : "Load event first"}
                                    />
                                </div>
                                <div className="form-col">
                                    <label htmlFor="updateEventDate">Event Date</label>
                                    <input 
                                        type="text" 
                                        id="updateEventDate" 
                                        value={updateEventDate} 
                                        onChange={(e) => setUpdateEventDate(e.target.value)} 
                                        required 
                                        disabled={!foundEvent}
                                        className={!foundEvent ? 'disabled-input' : ''}
                                        placeholder={foundEvent ? "Enter date" : "Load event first"}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="updateEventDuration">Duration</label>
                                    <input 
                                        type="text" 
                                        id="updateEventDuration" 
                                        value={updateEventDuration} 
                                        onChange={(e) => setUpdateEventDuration(e.target.value)} 
                                        required 
                                        disabled={!foundEvent}
                                        className={!foundEvent ? 'disabled-input' : ''}
                                        placeholder={foundEvent ? "Enter duration" : "Load event first"}
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                className="btn-admin btn-admin-primary"
                                disabled={!foundEvent}
                            >
                                Update Event
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <div className="admin-section">
                <div 
                    className="admin-section-header"
                    onClick={() => setExpandedSection(expandedSection === 'deleteEvent' ? null : 'deleteEvent')}
                >
                    <h3>
                        <i className="fas fa-trash-alt me-2"></i>
                        Delete Event
                    </h3>
                    <i className={`fas fa-chevron-${expandedSection === 'deleteEvent' ? 'up' : 'down'}`}></i>
                </div>
                {expandedSection === 'deleteEvent' && (
                    <div className="admin-section-content">
                        <form onSubmit={handleDeleteEvent} className="admin-form">
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="deleteEventId">Event ID</label>
                                    <input 
                                        type="text" 
                                        id="deleteEventId" 
                                        value={deleteEventId} 
                                        onChange={(e) => setDeleteEventId(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-admin btn-admin-danger">
                                Delete Event
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageEvents; 