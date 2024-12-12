import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Locator = () => {
    const [events, setEvents] = useState([]);
    const [userLocation, setUserLocation] = useState({ lat: 22.3964, lng: 114.1099 }); // Default to Hong Kong coordinates

    useEffect(() => {
        // Fetch user location
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        });

        // Fetch event data from HK government database
        const fetchEventData = async () => {
            try {
                const response = await fetch('https://api.example.com/hk-events'); // Replace with actual API endpoint
                const data = await response.json();
                setEvents(data); // Assuming data is an array of event objects with lat and lng properties
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };

        fetchEventData();
    }, []);

    const mapContainerStyle = {
        height: '400px',
        width: '100%',
    };

    const center = {
        lat: userLocation.lat,
        lng: userLocation.lng,
    };

    return (
        <>
            <main className="container mt-4" style={{ paddingTop: '70px' }}>
                <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"> {/* Replace with your API key */}
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={12}
                    >
                        {/* Marker for user location */}
                        <Marker position={userLocation} label="You" />

                        {/* Markers for events */}
                        {events.map((event, index) => (
                            <Marker
                                key={index}
                                position={{ lat: event.lat, lng: event.lng }}
                                title={event.name} // Assuming event has a name property
                            />
                        ))}
                    </GoogleMap>
                </LoadScript>
            </main>
        </>
    );
};

export default Locator; 