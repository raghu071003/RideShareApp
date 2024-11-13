// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';

// const socket = io('http://localhost:8090'); // Replace with your server URL

// function ChatComponent() {
//   const {driverId} = useParams();
//   const [userId,setUserId] = useState();
//   const roomId = driverId;
//   const [message, setMessage] = useState('');
//   const [chat, setChat] = useState([]);

//   useEffect(() => {
//     // Join the chat room
//     const getUserId = async()=>{
//       const res = await axios.get(
//         'http://localhost:8090/api/v1/user/getUser',
//         {
//             withCredentials: true,
//         }
//     );
//     if(res.status === 200){
//       setUserId(res.data.userId)
//       console.log(res.data);
      
//     }
//     }
//     getUserId()
//     socket.emit('joinRoom', { roomId });

//     // Listen for incoming messages
//     socket.on('chatMessage', (msg) => {
//       setChat((prevChat) => [...prevChat, msg]);
//     });

//     // Cleanup on component unmount
//     return () => {
//       socket.off('chatMessage');
//     };
//   }, [roomId]);

//   const sendMessage = () => {
//     if (message.trim()) {
//       socket.emit('chatMessage', { roomId, senderId: userId, message });
//       setMessage(''); // Clear input field after sending
//     }
//   };

//   return (
//     <div>
//       <h2>Chat Room: {roomId}</h2>
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

// export default ChatComponent;
