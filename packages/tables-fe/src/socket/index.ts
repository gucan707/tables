import { io, Socket } from "socket.io-client";

import { Events } from "@tables/types";

import { SERVER_BASE_URL } from "../http/url";

// export const socket = io(SERVER_BASE_URL, {
//   path: "/socket",
// });
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

  socket.emit(Events.JoinRoom, roomNumber);

  socket.on(Events.JoinRoom, (arg) => {
    console.log({ arg });
  });
  // socket.on(Events.GAME_BEGIN, gameBegin);
  // socket.on(Events.GAME_END, gameEnd);
  // socket.on(Events.ROOM_JOIN, roomJoin);
  // socket.on(Events.SHOW_MSG, showWSMsg);

  // socket.emit(Events.ROOM_JOIN, roomNumber);
}
