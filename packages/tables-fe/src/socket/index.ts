import { io, Socket } from "socket.io-client";

import { Events } from "@tables/types";

import { JWT_KEY } from "../http/request";
import { SERVER_BASE_URL } from "../http/url";

export let socket: Socket;
export function setup(roomNumber: string) {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
  }

  socket = io(SERVER_BASE_URL, {
    path: "/socket",
  });

  socket.on("connection", () => {
    console.log("socket connected");
  });

  const token = window.localStorage.getItem(JWT_KEY);
  socket.emit(Events.JoinRoom, {
    roomNumber,
    jwt: `Bearer ${token || ""}`,
  });

  socket.on(Events.JoinRoom, (arg) => {
    console.log({ arg });
  });
}
