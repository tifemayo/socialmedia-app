import React, { useEffect, useState } from 'react';

const Timer = ({ timeLimit, onLimitReached }) => {
    const [activeTime, setActiveTime] = useState(0);
    const [isActive, setIsActive] = useState(true);

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
            onLimitReached();
        }
    }, [activeTime, timeLimit, onLimitReached]);

    return (
        <div>
            <h2>Active Time Spent: {activeTime} seconds</h2>
        </div>
    );
};

export default Timer;