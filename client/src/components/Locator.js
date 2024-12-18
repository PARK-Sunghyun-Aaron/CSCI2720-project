import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Locator = () => {
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]);

    useEffect(() => {
        // Fetch venues data
        const fetchVenues = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/locations/listAllLocations');
                const data = await response.json();
                setVenues(data);
            } catch (error) {
                console.error('Error fetching venues:', error);
            }
        };

        fetchVenues();
    }, []);

    useEffect(() => {
        // Load Google Maps script
        const googleMapsScript = document.createElement("script");
        googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC6SJqInCt0heffya0W622QSkiaoXDHKFA`;
        googleMapsScript.async = true;
        googleMapsScript.onload = initMap;
        document.body.appendChild(googleMapsScript);

        function initMap() {
            const map = new window.google.maps.Map(document.getElementById("map"), {
                center: { lat: 22.444477, lng: 114.165562 }, // Hong Kong center
                zoom: 11,
            });

            // Group venues by location (latitude/longitude)
            const locationGroups = venues.reduce((groups, venue) => {
                const key = `${venue.latitude},${venue.longitude}`;
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(venue);
                return groups;
            }, {});

            // Create markers for each location group
            Object.entries(locationGroups).forEach(([coords, venuesAtLocation]) => {
                const [lat, lng] = coords.split(',').map(Number);
                
                // Create marker
                const marker = new window.google.maps.Marker({
                    position: { lat, lng },
                    map: map,
                    title: venuesAtLocation[0].location // Add title to show on hover
                });

                const content = `
                    <div style="padding: 10px;">
                        <h3 style="margin-bottom: 10px; color: #344767;">Venues at this location:</h3>
                        <ul style="list-style-type: none; padding-left: 0;">
                            ${venuesAtLocation.map(venue => `
                                <li style="margin-bottom: 8px;">
                                    <a href="/location/${venue.location}" style="text-decoration: none; color: #344767;">
                                        ${venue.location}
                                        <span style="color: #666; font-size: 0.9em;">
                                            (${venue.count} events)
                                        </span>
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;


                const infoWindow = new window.google.maps.InfoWindow({
                    content: content,
                    maxWidth: 300
                });

                // Add hover event listeners
                marker.addListener('mouseover', () => {
                    infoWindow.open(map, marker);
                });

                // Close info window with close button
                window.google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
                    const closeButton = document.getElementById('close-info-window');
                    if (closeButton) {
                      closeButton.addEventListener('click', () => {
                        infoWindow.close();
                      });
                    }
                  });

                // Add click event to navigate
                marker.addListener('click', () => {
                    navigate(`/location/${venuesAtLocation[0].location}`);
                });
            });
        }

        return () => {
            // Cleanup
            document.body.removeChild(googleMapsScript);
        };
    }, [venues, navigate]);

    return (
        <main className="container-fluid mt-4" style={{ paddingTop: '70px' }}>
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Location Map</h2>
                    <div 
                        id="map" 
                        style={{
                            width: "100%",
                            height: "70vh",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}
                    ></div>
                </div>
            </div>
        </main>
    );
};

export default Locator; 
