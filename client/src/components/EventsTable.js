// client/src/components/EventsTable.js
import React, { useState, useEffect } from 'react';

const EventsTable = () => {
    // State for filtering and searching
    const [distance, setDistance] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order
    const [sortedEvents, setSortedEvents] = useState([]); // State for sorted events
    const [favorites, setFavorites] = useState([]); // State for favorite locations
    const [selectedCategory, setSelectedCategory] = useState('All'); // State for selected category

    // Dummy data for events with categories
    const eventsData = [
        { id: 1, location: 'Central Park', numberOfEvents: 5, category: 'Outdoor' },
        { id: 2, location: 'The Met', numberOfEvents: 3, category: 'Museum' },
        { id: 3, location: 'Broadway', numberOfEvents: 10, category: 'Theater' },
        { id: 4, location: 'Times Square', numberOfEvents: 8, category: 'Tourist' },
        { id: 5, location: 'Brooklyn Bridge', numberOfEvents: 2, category: 'Outdoor' },
    ];

    // Function to handle sorting
    const handleSort = () => {
        const sortedData = [...eventsData].sort((a, b) => {
            return sortOrder === 'asc' 
                ? a.numberOfEvents - b.numberOfEvents 
                : b.numberOfEvents - a.numberOfEvents;
        });
        setSortedEvents(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
    };

    // Function to handle adding/removing favorites
    const toggleFavorite = (eventId) => {
        setFavorites(prevFavorites => {
            if (prevFavorites.includes(eventId)) {
                return prevFavorites.filter(id => id !== eventId); // Remove from favorites
            } else {
                return [...prevFavorites, eventId]; // Add to favorites
            }
        });
    };

    // Function to filter events based on selected category
    const filteredEvents = selectedCategory === 'All' 
        ? sortedEvents 
        : sortedEvents.filter(event => event.category === selectedCategory);

    // Initial sort on component mount
    useEffect(() => {
        setSortedEvents(eventsData);
    }, []);

    return (
        <main className="container mt-4" style={{ paddingTop: '70px', display: 'flex' }}>
            <div style={{ flex: 1,  width: '75%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <h1>Explore What's Popping</h1>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '10px' }}>
                            <p style={{ margin: 0 }}>Filter by Distance</p>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={distance} 
                                onChange={(e) => setDistance(e.target.value)} 
                            />
                            <p style={{ margin: 0 }}>{distance} km</p>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '20px' }} />

                {/* Events Table */}
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>ID</th>
                            <th style={{ textAlign: 'center' }}>Location</th>
                            <th onClick={handleSort} style={{ cursor: 'pointer', textAlign: 'center' }}>
                                Events {sortOrder === 'asc' ? '↑' : '↓'}
                            </th>
                            <th style={{ textAlign: 'center' }}>Favorite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map(event => (
                            <tr key={event.id}>
                                <td style={{ textAlign: 'center' }}>{event.id}</td>
                                <td style={{ textAlign: 'center' }}>{event.location}</td>
                                <td style={{ textAlign: 'center' }}>{event.numberOfEvents}</td>
                                <td onClick={() => toggleFavorite(event.id)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                                    {favorites.includes(event.id) ? (
                                        <i className="fa fa-heart" style={{ color: 'red' }}></i> // Filled heart
                                    ) : (
                                        <i className="far fa-heart"></i> // Outline heart
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Categories Section */}
            <div style={{ border: '1px solid #ccc', padding: '10px', marginLeft: '20px', width: '200px' }}>
                <h3>Categories</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {['All', 'Outdoor', 'Museum', 'Theater', 'Tourist'].map(category => (
                        <li 
                            key={category} 
                            onClick={() => setSelectedCategory(category)} 
                            style={{ cursor: 'pointer', padding: '5px', backgroundColor: selectedCategory === category ? '#f0f0f0' : 'transparent' }}
                        >
                            {category}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
};

export default EventsTable;