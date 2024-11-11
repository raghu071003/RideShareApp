import React, { createContext, useState, useContext } from 'react';

// Create the context
const NotificationContext = createContext();

// Create a custom hook for easier use
export const useNotification = () => useContext(NotificationContext);

// Create the provider component
export const NotificationProvider = ({ children }) => {
    const [hasPendingRequests, setHasPendingRequests] = useState(false);

    return (
        <NotificationContext.Provider value={{ hasPendingRequests, setHasPendingRequests }}>
            {children}
        </NotificationContext.Provider>
    );
};
