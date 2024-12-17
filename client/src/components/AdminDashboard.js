import React, { useState } from 'react';
import ManageUsers from './admin/ManageUsers';
import ManageEvents from './admin/ManageEvents';
import ManageLocations from './admin/ManageLocations';
import Toast from './common/Toast';
import './AdminDashboard.css';

const AdminDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('manageUsers');
    const [message, setMessage] = useState('');

    const handleMessage = (msg) => {
        setMessage(msg);
        if (msg) {
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'manageUsers':
                return <ManageUsers setMessage={handleMessage} />;
            case 'manageEvents':
                return <ManageEvents setMessage={handleMessage} />;
            case 'manageLocations':
                return <ManageLocations setMessage={handleMessage} />;
            default:
                return null;
        }
    };

    return (
        <main className="container-fluid mt-4" style={{ paddingTop: '70px' }}>
            <div className="row mb-4">
                <div className="col">
                    <h1 className="mb-2">Admin Dashboard</h1>
                    <h6 className="text-muted">Manage Users, Events, and Locations</h6>
                </div>
            </div>

            <div className="custom-tabs">
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'manageUsers' ? 'active' : ''}`}
                            onClick={() => setActiveTab('manageUsers')}
                        >
                            <i className="fas fa-users me-2"></i>
                            Users
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'manageEvents' ? 'active' : ''}`}
                            onClick={() => setActiveTab('manageEvents')}
                        >
                            <i className="fas fa-calendar-alt me-2"></i>
                            Events
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'manageLocations' ? 'active' : ''}`}
                            onClick={() => setActiveTab('manageLocations')}
                        >
                            <i className="fas fa-map-marker-alt me-2"></i>
                            Locations
                        </button>
                    </li>
                </ul>

                <div className="tab-content p-4 border border-top-0">
                    {renderTabContent()}
                </div>
            </div>
            
            <Toast 
                message={message} 
                onClose={() => setMessage('')}
            />
        </main>
    );
};

export default AdminDashboard;