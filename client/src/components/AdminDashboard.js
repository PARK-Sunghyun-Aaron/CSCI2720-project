import React from 'react';

const AdminDashboard = ({ user }) => {
    return (
        <div className="container mt-5">
            <h1>Admin Dashboard</h1>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Welcome, {user.firstName} {user.lastName}</h5>
                    <p className="card-text">Email: {user.email}</p>
                    <p className="card-text">Role: Administrator</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 