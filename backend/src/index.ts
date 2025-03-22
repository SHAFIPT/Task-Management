import "reflect-metadata";
import './config/container';
import express from 'express';
import 'dotenv/config'
import * as dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors"; 
import { errorHandler } from './middleware/errorHandling';
import router from './routes/router';
import connectDB from "./config/db";
import { initializeSocket } from "./socket";
import { setIo } from "./socketInstance";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Configure CORS for Express
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true         
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

app.use('/', router);
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MERN API' });
});
app.use(errorHandler);

// Initialize socket with the Express app
// After initializing socket
const { io, server } = initializeSocket(app);
setIo(io);

// Log when the socket is initialized
console.log("Socket.io initialized successfully");

connectDB();

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export io for use in other files
export { io };