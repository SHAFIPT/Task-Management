import http from "http";
import { Server } from "socket.io";
import { Express } from "express";

// Add proper types
let server: http.Server;
let io: Server;

const initializeSocket = (app: Express) => {
  server = http.createServer(app);
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  // Listen for connections
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  
  return { io, server };
};

export { initializeSocket };