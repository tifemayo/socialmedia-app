import React, { createContext, useState, useEffect, useContext } from 'react';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [activeTime, setActiveTime] = useState(0);
    const [timeLimit, setTimeLimit] = useState(0);
    const [dailyGoal, setDailyGoal] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        // Load saved settings
        const savedLimit = localStorage.getItem('dailyLimit');
        const savedGoal = localStorage.getItem('dailyGoal');
        if (savedLimit) setTimeLimit(Number(savedLimit));
        if (savedGoal) setDailyGoal(savedGoal);

        // Start the timer
        let timer;
        if (isActive && timeLimit > 0) {
            timer = setInterval(() => {
                setActiveTime(prev => prev + 1);
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

    const updateTimerSettings = (newLimit, newGoal) => {
        setTimeLimit(newLimit);
        setDailyGoal(newGoal);
        localStorage.setItem('dailyLimit', newLimit);
        localStorage.setItem('dailyGoal', newGoal);
    };

    return (
        <TimerContext.Provider value={{
            activeTime,
            timeLimit,
            dailyGoal,
            showNotification,
            setShowNotification,
            updateTimerSettings
        }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);