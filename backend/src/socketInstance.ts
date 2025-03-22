// src/socketInstance.ts
import { Server } from "socket.io";

// This module will be imported by any file that needs access to the io instance
let io: Server | null = null;

export const setIo = (socketIo: Server) => {
  io = socketIo;
};

export const getIo = (): Server | null => {
  return io;
};