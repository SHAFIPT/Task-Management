// src/utils/socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true, // Make sure this matches your backend CORS config
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