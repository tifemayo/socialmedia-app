import React from 'react';
import './Notification.scss'; // Add styles for the modal

const Notification = ({ message, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Time Limit Reached</h2>
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Notification;