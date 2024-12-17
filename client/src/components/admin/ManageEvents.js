import React, { useState } from 'react';
import axios from 'axios';
import './AdminForms.css';

const ManageEvents = ({ setMessage }) => {
    const [expandedSection, setExpandedSection] = useState(null);
    
    // Event management state variables
    const [listEvents, setListEvents] = useState([]);
    const [findEventId, setFindEventId] = useState('');
    const [newEventName, setNewEventName] = useState('');
    const [newEventQuota, setNewEventQuota] = useState('');
    const [locationName, setLocationName] = useState('');
    const [deleteEventId, setDeleteEventId] = useState('');
    const [foundEvent, setFoundEvent] = useState(null);
    const [loadEventId, setLoadEventId] = useState('');
    const [updateEventName, setUpdateEventName] = useState('');
    const [updateEventQuota, setUpdateEventQuota] = useState('');
    const [updateEventLocationId, setUpdateEventLocationId] = useState('');

    // Event management functions
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

    const handleFindEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5001/api/events/loadEvent/${findEventId}`);
            setFoundEvent(response.data);
            setMessage(`Event found: ${response.data.name}`);
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error finding event');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/events/createEvent', {
                name: newEventName,
                quota: newEventQuota,
                loc: locationName,
            });
            setMessage('Event created successfully');
            // Clear form fields
            setNewEventName('');
            setNewEventQuota('');
            setLocationName('');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error creating event');
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

    const handleLoadEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5001/api/events/loadEvent/${loadEventId}`);
            setFoundEvent(response.data);
            // Populate update fields
            setUpdateEventName(response.data.name);
            setUpdateEventQuota(response.data.quota);
            setUpdateEventLocationId(response.data.loc);
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
                name: updateEventName,
                quota: updateEventQuota,
                loc: updateEventLocationId,
            });
            setMessage('Event updated successfully');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error updating event');
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
                                    <label htmlFor="newEventName">Event Name</label>
                                    <input 
                                        type="text" 
                                        id="newEventName" 
                                        value={newEventName} 
                                        onChange={(e) => setNewEventName(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="form-col">
                                    <label htmlFor="newEventQuota">Event Quota</label>
                                    <input 
                                        type="number" 
                                        id="newEventQuota" 
                                        value={newEventQuota} 
                                        onChange={(e) => setNewEventQuota(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="locationName">Location Name</label>
                                    <input 
                                        type="text" 
                                        id="locationName" 
                                        value={locationName} 
                                        onChange={(e) => setLocationName(e.target.value)} 
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
                                        <p><strong>Name:</strong> {event.name}</p>
                                        <p><strong>Quota:</strong> {event.quota}</p>
                                        <p><strong>Location:</strong> {event.loc.locName}</p>
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
                    onClick={() => setExpandedSection(expandedSection === 'findEvent' ? null : 'findEvent')}
                >
                    <h3>
                        <i className="fas fa-search me-2"></i>
                        Find Event
                    </h3>
                    <i className={`fas fa-chevron-${expandedSection === 'findEvent' ? 'up' : 'down'}`}></i>
                </div>
                {expandedSection === 'findEvent' && (
                    <div className="admin-section-content">
                        <form onSubmit={handleFindEvent} className="admin-form">
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="findEventId">Event ID</label>
                                    <input 
                                        type="text" 
                                        id="findEventId" 
                                        value={findEventId} 
                                        onChange={(e) => setFindEventId(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            {foundEvent && (
                                <div className="admin-card mt-3">
                                    <p><strong>Name:</strong> {foundEvent.name}</p>
                                    <p><strong>Quota:</strong> {foundEvent.quota}</p>
                                    <p><strong>Location:</strong> {foundEvent.loc.locName}</p>
                                </div>
                            )}
                            <button type="submit" className="btn-admin btn-admin-primary">
                                Find Event
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
                                    <label htmlFor="updateEventName">Event Name</label>
                                    <input 
                                        type="text" 
                                        id="updateEventName" 
                                        value={updateEventName} 
                                        onChange={(e) => setUpdateEventName(e.target.value)} 
                                        required 
                                        disabled={!foundEvent}
                                        className={!foundEvent ? 'disabled-input' : ''}
                                        placeholder={foundEvent ? "Enter event name" : "Load event first"}
                                    />
                                </div>
                                <div className="form-col">
                                    <label htmlFor="updateEventQuota">Event Quota</label>
                                    <input 
                                        type="number" 
                                        id="updateEventQuota" 
                                        value={updateEventQuota} 
                                        onChange={(e) => setUpdateEventQuota(e.target.value)} 
                                        required 
                                        disabled={!foundEvent}
                                        className={!foundEvent ? 'disabled-input' : ''}
                                        placeholder={foundEvent ? "Enter quota" : "Load event first"}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="updateEventLocation">Location ID</label>
                                    <input 
                                        type="text" 
                                        id="updateEventLocation" 
                                        value={updateEventLocationId} 
                                        onChange={(e) => setUpdateEventLocationId(e.target.value)} 
                                        required 
                                        disabled={!foundEvent}
                                        className={!foundEvent ? 'disabled-input' : ''}
                                        placeholder={foundEvent ? "Enter location ID" : "Load event first"}
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