// import React, { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// const NotificationComponent = ({ driverId }) => {
//     const [notifications, setNotifications] = useState([]);
//     const socket = io('http://localhost:3000');  // Connect to the backend server

//     useEffect(() => {
//         // Join a room for the specific driverId (this can be used to target a specific driver)
//         socket.emit('join', driverId);

//         // Listen for the 'new-ride-request' event
//         socket.on('new-ride-request', (notification) => {
//             if (notification.driverId === driverId) {
//                 setNotifications((prevNotifications) => [
//                     ...prevNotifications,
//                     notification.message,
//                 ]);
//             }
//         });

//         return () => {
//             socket.disconnect();
//         };
//     }, [driverId]);

//     return (
//         <div className="notification-container">
//             {notifications.length > 0 && (
//                 <div className="notification-box">
//                     <h3>You have new notifications:</h3>
//                     <ul>
//                         {notifications.map((message, index) => (
//                             <li key={index}>{message}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default NotificationComponent;
