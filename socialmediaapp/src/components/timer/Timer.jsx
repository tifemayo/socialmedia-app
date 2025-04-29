import React, { useEffect, useState } from 'react';
import './Timer.scss'; 
import { useNotification } from '../../context/notificationContext'; // Import the notification context

const Timer = ({ timeLimit }) => {
    const [activeTime, setActiveTime] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const { showNotification } = useNotification(); // Get the showNotification function

    useEffect(() => {
        let timer;
        if (isActive) {
            timer = setInterval(() => {
                setActiveTime(prevTime => prevTime + 1);
            }, 1000); // Increment every second
        }

        return () => clearInterval(timer);
    }, [isActive]);

    useEffect(() => {
        if (activeTime >= timeLimit) {
            setIsActive(false);
            showNotification(`You have elapsed your time. Go work on your goal!`); // Show notification
        }
    }, [activeTime, timeLimit, showNotification]);

    useEffect(() => {
        console.log(`Active Time: ${activeTime}`);
    }, [activeTime]);

    return (
        <div>
            <h2 className="active">Active Time Spent: {activeTime} seconds</h2>
        </div>
    );
};

export default Timer;