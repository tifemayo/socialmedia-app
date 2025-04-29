import React, { useEffect, useState } from 'react';
import './Timer.scss'; 
import Notification from '../timerNotification/Notification';

const Timer = ({ timeLimit, dailyGoal }) => {
    const [activeTime, setActiveTime] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        let timer;
        if (isActive && timeLimit > 0) {
            timer = setInterval(() => {
                setActiveTime(prevTime => prevTime + 1);
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [isActive, timeLimit]);

    useEffect(() => {
        if (timeLimit > 0 && activeTime >= timeLimit) {
            setIsActive(false);
            setShowNotification(true);
        }
    }, [activeTime, timeLimit]);

    return (
        <div>
            <h2 className="active">Active Time Spent: {activeTime} seconds</h2>
            {showNotification && (
                <Notification
                    message={`You have reached your time limit of ${timeLimit} seconds. Your goal was: ${dailyGoal}`}
                    onClose={() => setShowNotification(false)}
                />
            )}
        </div>
    );
};

export default Timer;