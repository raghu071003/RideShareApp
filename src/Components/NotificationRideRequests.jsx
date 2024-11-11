import React from 'react';
import { useNotification } from '../Context/NotificationContext';
import { Bell } from 'lucide-react';

const NotificationBanner = () => {
    const { hasPendingRequests } = useNotification();

    return (
        hasPendingRequests && (
            <div className="fixed top-0 w-full bg-yellow-300 text-center py-3 shadow-md">
                <Bell className="inline mr-2" /> You have pending ride requests!
            </div>
        )
    );
};

export default NotificationBanner;
