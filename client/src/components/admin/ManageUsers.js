import React, { useState } from 'react';
import axios from 'axios';
import './AdminForms.css';

const ManageUsers = ({ setMessage }) => {
    const [expandedSection, setExpandedSection] = useState(null);
    
    // User management state variables
    const [listUsers, setListUsers] = useState([]);
    const [loadUserEmail, setLoadUserEmail] = useState('');
    const [updateUserEmail, setUpdateUserEmail] = useState('');
    const [updateUserPassword, setUpdateUserPassword] = useState('');
    const [updateUserFirstName, setUpdateUserFirstName] = useState('');
    const [updateUserLastName, setUpdateUserLastName] = useState('');
    const [deleteUserEmail, setDeleteUserEmail] = useState('');
    const [loadedUser, setLoadedUser] = useState(null);
    
    // New user state variables
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserFirstName, setNewUserFirstName] = useState('');
    const [newUserLastName, setNewUserLastName] = useState('');
    const [newUserRole, setNewUserRole] = useState('user');

    // User management functions
    const handleListUsers = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5001/api/users/readAllUsers');
            setListUsers(response.data);
            setMessage('Users listed successfully');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error listing users');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleLoadUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5001/api/users/loadUser/${loadUserEmail}`);
            setLoadedUser(response.data);
            setUpdateUserEmail(response.data.email);
            setUpdateUserFirstName(response.data.firstName);
            setUpdateUserLastName(response.data.lastName);
            setUpdateUserPassword('');
            setMessage(`User loaded: ${response.data.firstName} ${response.data.lastName}`);
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error loading user');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5001/api/users/updateUser/${updateUserEmail}`, {
                email: updateUserEmail,
                password: updateUserPassword,
                firstName: updateUserFirstName,
                lastName: updateUserLastName,
            });
            setMessage('User updated successfully');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error updating user');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleDeleteUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5001/api/users/deleteUser/${deleteUserEmail}`);
            setDeleteUserEmail('');
            setMessage('User deleted successfully');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error deleting user');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/users/createUser', {
                email: newUserEmail,
                password: newUserPassword,
                firstName: newUserFirstName,
                lastName: newUserLastName,
                role: newUserRole,
            });
            setMessage('User created successfully');
            // Clear the form fields after successful creation
            setNewUserEmail('');
            setNewUserPassword('');
            setNewUserFirstName('');
            setNewUserLastName('');
            setNewUserRole('user');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error creating user');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    return (
        <div className="tab-content w-100">
            <div className="admin-section">
                <div 
                    className="admin-section-header"
                    onClick={() => setExpandedSection(expandedSection === 'createUser' ? null : 'createUser')}
                >
                    <h3>
                        <i className="fas fa-user-plus me-2"></i>
                        Create New User
                    </h3>
                    <i className={`fas fa-chevron-${expandedSection === 'createUser' ? 'up' : 'down'}`}></i>
                </div>
                {expandedSection === 'createUser' && (
                    <div className="admin-section-content">
                        <form onSubmit={handleCreateUser} className="admin-form">
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="newUserEmail">Email Address</label>
                                    <input 
                                        type="email" 
                                        id="newUserEmail" 
                                        value={newUserEmail} 
                                        onChange={(e) => setNewUserEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="form-col">
                                    <label htmlFor="newUserPassword">Password</label>
                                    <input 
                                        type="password" 
                                        id="newUserPassword" 
                                        value={newUserPassword} 
                                        onChange={(e) => setNewUserPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="newUserFirstName">First Name</label>
                                    <input 
                                        type="text" 
                                        id="newUserFirstName" 
                                        value={newUserFirstName} 
                                        onChange={(e) => setNewUserFirstName(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="form-col">
                                    <label htmlFor="newUserLastName">Last Name</label>
                                    <input 
                                        type="text" 
                                        id="newUserLastName" 
                                        value={newUserLastName} 
                                        onChange={(e) => setNewUserLastName(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="newUserRole">Role</label>
                                    <select 
                                        id="newUserRole" 
                                        value={newUserRole} 
                                        onChange={(e) => setNewUserRole(e.target.value)} 
                                        required
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn-admin btn-admin-primary">
                                Create User
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <div className="admin-section">
                <div 
                    className="admin-section-header"
                    onClick={() => setExpandedSection(expandedSection === 'listUsers' ? null : 'listUsers')}
                >
                    <h3>
                        <i className="fas fa-list me-2"></i>
                        List All Users
                    </h3>
                    <i className={`fas fa-chevron-${expandedSection === 'listUsers' ? 'up' : 'down'}`}></i>
                </div>
                {expandedSection === 'listUsers' && (
                    <div className="admin-section-content">
                        <form onSubmit={handleListUsers} className="admin-form">
                            <div className="data-list">
                                {listUsers.map((user) => (
                                    <div key={user.email} className="admin-card p-3 mb-2 border rounded">
                                        <p><strong>Email:</strong> {user.email}</p>
                                        <p><strong>First Name:</strong> {user.firstName}</p>
                                        <p><strong>Last Name:</strong> {user.lastName}</p>
                                        <p><strong>Role:</strong> {user.role}</p>
                                    </div>
                                ))}
                            </div>
                            <button type="submit" className="btn-admin btn-admin-primary">
                                List Users
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <div className="admin-section">
                <div 
                    className="admin-section-header"
                    onClick={() => setExpandedSection(expandedSection === 'updateUser' ? null : 'updateUser')}
                >
                    <h3>
                        <i className="fas fa-user-edit me-2"></i>
                        Load and Update User
                    </h3>
                    <i className={`fas fa-chevron-${expandedSection === 'updateUser' ? 'up' : 'down'}`}></i>
                </div>
                {expandedSection === 'updateUser' && (
                    <div className="admin-section-content">
                        {/* Load User Form */}
                        <form onSubmit={handleLoadUser} className="admin-form mb-4">
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="loadUserEmail">Email Address</label>
                                    <div className="d-flex gap-2">
                                        <input 
                                            type="email" 
                                            id="loadUserEmail" 
                                            value={loadUserEmail} 
                                            onChange={(e) => setLoadUserEmail(e.target.value)} 
                                            required 
                                            placeholder="Enter user email"
                                            style={{ marginBottom: 0 }}
                                        />
                                        <button type="submit" className="btn-admin btn-admin-primary" style={{ minWidth: '125px' }}>
                                            Load User
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Update User Form */}
                        <form onSubmit={handleUpdateUser} className="admin-form">
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="updateUserEmail">Email Address</label>
                                    <input 
                                        type="email" 
                                        id="updateUserEmail" 
                                        value={updateUserEmail} 
                                        onChange={(e) => setUpdateUserEmail(e.target.value)} 
                                        required 
                                        disabled={!loadedUser}
                                        className={!loadedUser ? 'disabled-input' : ''}
                                    />
                                </div>
                                <div className="form-col">
                                    <label htmlFor="updateUserPassword">New Password</label>
                                    <input 
                                        type="password" 
                                        id="updateUserPassword" 
                                        value={updateUserPassword} 
                                        onChange={(e) => setUpdateUserPassword(e.target.value)} 
                                        required 
                                        disabled={!loadedUser}
                                        className={!loadedUser ? 'disabled-input' : ''}
                                        placeholder={loadedUser ? "Enter new password" : "Load user first"}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="updateUserFirstName">First Name</label>
                                    <input 
                                        type="text" 
                                        id="updateUserFirstName" 
                                        value={updateUserFirstName} 
                                        onChange={(e) => setUpdateUserFirstName(e.target.value)} 
                                        required 
                                        disabled={!loadedUser}
                                        className={!loadedUser ? 'disabled-input' : ''}
                                    />
                                </div>
                                <div className="form-col">
                                    <label htmlFor="updateUserLastName">Last Name</label>
                                    <input 
                                        type="text" 
                                        id="updateUserLastName" 
                                        value={updateUserLastName} 
                                        onChange={(e) => setUpdateUserLastName(e.target.value)} 
                                        required 
                                        disabled={!loadedUser}
                                        className={!loadedUser ? 'disabled-input' : ''}
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                className="btn-admin btn-admin-primary"
                                disabled={!loadedUser}
                            >
                                Update User
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <div className="admin-section">
                <div 
                    className="admin-section-header"
                    onClick={() => setExpandedSection(expandedSection === 'deleteUser' ? null : 'deleteUser')}
                >
                    <h3>
                        <i className="fas fa-user-minus me-2"></i>
                        Delete User
                    </h3>
                    <i className={`fas fa-chevron-${expandedSection === 'deleteUser' ? 'up' : 'down'}`}></i>
                </div>
                {expandedSection === 'deleteUser' && (
                    <div className="admin-section-content">
                        <form onSubmit={handleDeleteUser} className="admin-form">
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="deleteUserEmail">Email Address</label>
                                    <input 
                                        type="text" 
                                        id="deleteUserEmail" 
                                        value={deleteUserEmail} 
                                        onChange={(e) => setDeleteUserEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-admin btn-admin-danger">
                                Delete User
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers; 