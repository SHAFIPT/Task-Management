// src/utils/socket.ts
import { io } from "socket.io-client";

// Get the Socket.io URL from environment variables
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;

// Log which URL we're using for debugging
console.log("Connecting to socket server at:", SOCKET_URL);

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
});

// Add connection logging
socket.on("connect", () => {
  console.log("Socket connected with ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

export default socket;