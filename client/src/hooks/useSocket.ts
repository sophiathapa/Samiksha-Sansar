"use client";
import { useEffect } from "react";
import { socket } from "@/lib/socket";

export function useSocket() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect(); // cleanup on unmount
    };
  }, []);

  return socket;
}