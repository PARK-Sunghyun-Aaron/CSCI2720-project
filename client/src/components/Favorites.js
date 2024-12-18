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
import './Favorites.css';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const userEmail = localStorage.getItem('userEmail');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                // First get user's favorite location IDs
                const userResponse = await axios.get(`http://localhost:5001/api/users/loadUser/${userEmail}`);
                const favoriteIds = userResponse.data.locations || [];

                // Then fetch all locations
                const locationsResponse = await axios.get('http://localhost:5001/location');
                const allLocations = locationsResponse.data;

                // Filter locations to get only favorites
                const favoriteLocations = allLocations.filter(location => 
                    favoriteIds.includes(location.venueid)
                );

                setFavorites(favoriteLocations);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [userEmail]);

    const handleRemoveFavorite = async (venueid) => {
        try {
            const userResponse = await axios.get(`http://localhost:5001/api/users/loadUser/${userEmail}`);
            const currentFavorites = userResponse.data.locations || [];

            // Remove the location from favorites
            const updatedFavorites = currentFavorites.filter(id => id !== venueid);

            await axios.put(`http://localhost:5001/api/users/updateUser/${userEmail}`, {
                locations: updatedFavorites
            });

            // Update local state
            setFavorites(favorites.filter(location => location.venueid !== venueid));
        } catch (error) {
            console.error('Error removing favorite:', error);
            alert('Failed to remove from favorites');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <main className="container mt-4" style={{ paddingTop: '70px' }}>
            <h1 className="mb-4">My Locations</h1>
            <div className="row">
                {favorites.map(location => (
                    <div key={location.venueid} className="col-md-4 mb-4">
                        <div className="favorite-card" onClick={() => navigate(`/location/${location.location}`)}>
                            <div className="favorite-card-header">
                                <h5>{location.location}</h5>
                                <span className="venue-id">
                                    Venue ID: {location.venueid}
                                </span>
                            </div>
                            <div className="favorite-card-body">
                                <p><strong>Events Count:</strong> {location.count}</p>
                                <p><strong>Coordinates:</strong></p>
                                <p>Latitude: {location.latitude}</p>
                                <p>Longitude: {location.longitude}</p>
                            </div>
                            <div className="favorite-card-footer">
                                <button 
                                    className="btn btn-outline-danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveFavorite(location.venueid);
                                    }}
                                >
                                    Remove from Favorites
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {favorites.length === 0 && (
                    <div className="col-12 text-center">
                        <p>No favorite locations found</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Favorites;
