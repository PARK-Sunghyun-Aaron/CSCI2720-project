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
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './LocationDetail.css';

const LocationDetail = () => {
    const { locName } = useParams();
    const [location, setLocation] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const userEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        const fetchLocationDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/locations/loadLocation/${locName}`);
                setLocation(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching location:', error);
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/locations/comments/${locName}`);
                setComments(response.data || []);
            } catch (error) {
                console.error('Error fetching comments:', error);
                setComments([]);
            }
        };

        fetchLocationDetails();
        fetchComments();
    }, [locName]);

    useEffect(() => {
        if (location) {
            // Load Google Maps script
            const googleMapsScript = document.createElement("script");
            googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC6SJqInCt0heffya0W622QSkiaoXDHKFA`;
            googleMapsScript.async = true;
            googleMapsScript.onload = initMap;
            document.body.appendChild(googleMapsScript);

            function initMap() {
                const map = new window.google.maps.Map(document.getElementById("locationMap"), {
                    center: { 
                        lat: parseFloat(location.latitude), 
                        lng: parseFloat(location.longitude) 
                    },
                    zoom: 15,
                });

                // Add marker for the location
                new window.google.maps.Marker({
                    position: { 
                        lat: parseFloat(location.latitude), 
                        lng: parseFloat(location.longitude) 
                    },
                    map: map,
                    title: location.location
                });
            }

            return () => {
                document.body.removeChild(googleMapsScript);
            };
        }
    }, [location]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(`http://localhost:5001/api/locations/comments/${locName}`, {
                text: newComment,
                userId: userEmail, // Replace with actual user ID from auth
            });

            setComments(prevComments => [...prevComments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (!location) {
        return <div className="error-message">Location not found</div>;
    }

    return (
        <main className="container mt-4" style={{ paddingTop: '70px' }}>
            <div className="location-detail">
                {/* Location Details Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h2 className="card-title">{location.location}</h2>
                        <div className="location-info">
                            <p><strong>Venue ID:</strong> {location.venueid}</p>
                            <p><strong>Number of Events:</strong> {location.count}</p>
                            <p><strong>Coordinates:</strong> {location.latitude}, {location.longitude}</p>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h3 className="card-title">Location Map</h3>
                        <div 
                            id="locationMap" 
                            className="location-map"
                            style={{
                                height: "400px",
                                borderRadius: "8px",
                                marginTop: "1rem"
                            }}
                        ></div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title mb-4">Comments</h3>
                        
                        {/* Comment Form */}
                        <form onSubmit={handleCommentSubmit} className="mb-4">
                            <div className="form-group">
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary mt-2">
                                Post Comment
                            </button>
                        </form>

                        {/* Comments List */}
                        <div className="comments-list">
                            {comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <div key={index} className="comment-item">
                                        <div className="comment-header">
                                            <strong>{comment.userId}</strong>
                                            <span className="text-muted">
                                                {new Date(comment.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="comment-text">{comment.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No comments yet. Be the first to comment!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LocationDetail; 
