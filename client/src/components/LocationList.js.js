import React from 'react';
import { Table } from 'react-bootstrap';

const LocationList = ({ locations }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Location Name</th>
                    <th>Number of Events</th>
                </tr>
            </thead>
            <tbody>
                {locations.map(location => (
                    <tr key={location.id}>
                        <td><a href={`/location/${location.id}`}>{location.name}</a></td>
                        <td>{location.eventCount}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default LocationList;