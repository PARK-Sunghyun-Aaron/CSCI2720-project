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
