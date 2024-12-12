import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome

const FavoritesTable = ({ favorites, setFavorites, userName }) => {
    // Dummy data for events with categories (this would be fetched from the database)
    const eventsData = [
        { id: 1, location: 'Central Park', numberOfEvents: 5, category: 'Outdoor' },
        { id: 2, location: 'The Met', numberOfEvents: 3, category: 'Museum' },
        { id: 3, location: 'Broadway', numberOfEvents: 10, category: 'Theater' },
        { id: 4, location: 'Times Square', numberOfEvents: 8, category: 'Tourist' },
        { id: 5, location: 'Brooklyn Bridge', numberOfEvents: 2, category: 'Outdoor' },
    ];

    const [sortedFavorites, setSortedFavorites] = useState([]); // State for sorted favorite events
    const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order

    // Function to handle sorting
    const handleSort = () => {
        const sortedData = [...sortedFavorites].sort((a, b) => {
            return sortOrder === 'asc' 
                ? a.numberOfEvents - b.numberOfEvents 
                : b.numberOfEvents - a.numberOfEvents;
        });
        setSortedFavorites(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
    };

    // Filter favorites from eventsData
    useEffect(() => {
        const favoriteEvents = eventsData.filter(event => favorites.includes(event.id));
        setSortedFavorites(favoriteEvents);
    }, [favorites]);

    // Function to handle removal of a favorite
    const handleRemoveFavorite = (eventId) => {
        if (window.confirm("Are you sure you want to remove this location from favorites?")) {
            setFavorites(prevFavorites => prevFavorites.filter(id => id !== eventId));
        }
    };

    return (
        <main className="container mt-4" style={{ paddingTop: '70px' }}>
            <h1>{userName}'s Top Picks</h1>
            {/* Events Table */}
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Location</th>
                        <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                            Number of Events {sortOrder === 'asc' ? '↑' : '↓'}
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {sortedFavorites.map(event => (
                        <tr key={event.id}>
                            <td>{event.id}</td>
                            <td>{event.location}</td>
                            <td>{event.numberOfEvents}</td>
                            <td>
                                <button onClick={() => handleRemoveFavorite(event.id)} className="btn btn-danger btn-sm">
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
};

export default FavoritesTable;