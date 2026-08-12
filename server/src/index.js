import express from "express";
import dotenv from "dotenv";
import connect from "./db/connect.js";
import userRoutes from "./routes/user.js";
import bookRoutes from "./routes/book.js";
import reviewRoutes from "./routes/review.js";
import bookAIRoutes from "./routes/bookAI.js";
import notificationRoutes from "./routes/notifications.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

connect();

const PORT = process.env.PORT || 8000;

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

app.use("/uploads", express.static("uploads"));

app.use(userRoutes);
app.use(bookRoutes);
app.use(reviewRoutes);
app.use(bookAIRoutes);
app.use(notificationRoutes);

io.on("connection", (socket) => {
  console.log("client connected");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", ({ roomId, message }) => {
    io.to(roomId).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});