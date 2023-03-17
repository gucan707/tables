import { Server } from "socket.io";

import { Events, ReqJoinRoom } from "@tables/types";

import { joinRoom } from "./joinRoom";

export function setup(io: Server) {
  io.on("connection", (socket) => {
    console.log("socket connected", socket.id);

    socket.on(Events.JoinRoom, (req: ReqJoinRoom) => joinRoom(req, socket, io));
  });
}
