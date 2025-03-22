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
        origin: [
          'https://task-management-o2giuotia-shafis-projects-0d77721d.vercel.app',
          'https://task-management-6s3v0wk7y-shafis-projects-0d77721d.vercel.app', 
          'https://task-management-six-lilac.vercel.app',
          'http://localhost:5173'
        ],
        methods: ["GET", "POST"],
        credentials: true
      }
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