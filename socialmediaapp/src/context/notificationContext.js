import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ message: '', visible: false });

    const showNotification = (message) => {
        setNotification({ message, visible: true });
        setTimeout(() => {
            setNotification({ message: '', visible: false });
        }, 5000); // Hide after 5 seconds
    };

    return (
        <NotificationContext.Provider value={{ notification, showNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationContext);
};