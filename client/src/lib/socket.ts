import { io, Socket } from "socket.io-client";

export const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  autoConnect: false, // connect manually when needed
});