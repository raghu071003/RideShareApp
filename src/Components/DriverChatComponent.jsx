// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';

// const socket = io('http://localhost:8090');

// function DriverChatComponent() {
//   const [userId, setUserId] = useState(null);
//   const [message, setMessage] = useState(''); 
//   const [chat, setChat] = useState([]); 

//   useEffect(() => {
    
//     const getUserId = async () => {
//       try {
//         const res = await axios.get('http://localhost:8090/api/v1/driver/getUser', {
//           withCredentials: true,
//         });
//         if (res.status === 200 && res.data.userId) {
//           setUserId(res.data.userId); 
//         } else {
//           console.error('Driver is not authenticated');
//         }
//       } catch (error) {
//         console.error('Error fetching driver data:', error);
//       }
//     };

//     getUserId();
  


//     if (userId) {
//       socket.emit('joinRoom', { roomId });
//       socket.on('chatMessage', (msg) => {
//         setChat((prevChat) => [...prevChat, msg]);
//       });
//     }

//     return () => {
//       socket.off('chatMessage');
//     };
//   }, [userId]);
//   const roomId = userId
//   const sendMessage = () => {
//     if (message.trim() && userId) {
//       socket.emit('chatMessage', { roomId, senderId: userId, message });
//       setMessage('');
//     }
//   };

//   return (
//     <div>
//       <h2>Driver Chat Room: {roomId}</h2>
//       <div>
//         {chat.map((msg, index) => (
//           <div key={index}>
//             <strong>{msg.senderId}</strong>: {msg.message} <em>{new Date(msg.timestamp).toLocaleTimeString()}</em>
//           </div>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type a message"
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// }

// export default DriverChatComponent;
