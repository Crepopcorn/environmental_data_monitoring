// frontend/src/socket.js
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_URL); // Ensure this matches the backend URL (e.g., http://localhost:4000)

export default socket;

