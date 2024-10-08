import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_URL); // Ensure .env location matches backend URL (e.g., http://localhost:4000)

export default socket;

