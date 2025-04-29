import React from 'react';
import './Notification.scss';
import { useTimer } from '../../context/timerContext';

const Notification = () => {
    const { showNotification, setShowNotification, timeLimit, dailyGoal } = useTimer();

    if (!showNotification) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Time Limit Reached!</h2>
                <p>You have reached your daily limit of {timeLimit} seconds.</p>
                <p>Remember your goal: {dailyGoal}</p>
                <button onClick={() => setShowNotification(false)}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default Notification;