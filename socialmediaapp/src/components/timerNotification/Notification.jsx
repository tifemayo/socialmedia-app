import React, { useEffect } from 'react';
import './Notification.scss'; // Add styles for the modal

const Notification = ({ message, onClose, duration }) => {
    // Automatically close the notification after the specified duration
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer); // Cleanup on unmount
        }
    }, [duration, onClose]);

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