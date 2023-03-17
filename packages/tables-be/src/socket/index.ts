import { Server } from "socket.io";

import { Events } from "@tables/types";

export function setup(io: Server) {
  io.on("connection", (socket) => {
    console.log("socket connected");

    socket.on(Events.JoinRoom, (roomNumber: string) => {
      console.log({ roomNumber });

      socket.join(roomNumber);
    });
  });
}
