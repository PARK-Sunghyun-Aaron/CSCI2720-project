import React from 'react';
import './Toast.css';

const Toast = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="toast-container">
            <div className="toast-message">
                <span>{message}</span>
                <button onClick={onClose} className="toast-close">&times;</button>
            </div>
        </div>
    );
};

export default Toast; 