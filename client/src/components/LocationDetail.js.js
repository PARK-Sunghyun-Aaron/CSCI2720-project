import React from 'react';
import MapView from './MapView';
import UserComments from './UserComments';

const LocationDetail = ({ location }) => {
    return (
        <div>
            <h2>{location.name}</h2>
            <p>{location.description}</p>
            <p>Presenter: {location.presenter}</p>
            <p>Date/Time: {location.dateTime}</p>
            <MapView latitude={location.latitude} longitude={location.longitude} />
            <UserComments locationId={location.id} />
        </div>
    );
};

export default LocationDetail;