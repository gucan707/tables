import { Socket } from "socket.io";

import { Events } from "@tables/types";

import { io } from "../";
import { roomToUsers } from "./joinRoom";

export async function leaveRoom(socket: Socket) {
  console.log("leave room", socket.rooms);
  const roomId = [...socket.rooms].filter((room) => room !== socket.id)[0];
  if (!roomId || !roomToUsers[roomId]) {
    console.error("roomId 不存在");
    return;
  }

  roomToUsers[roomId] = roomToUsers[roomId].filter(
    (user) => user.socketId !== socket.id
  );

  if (!roomToUsers[roomId].length) {
    delete roomToUsers[roomId];
  }

  io.to(roomId).emit(Events.EmitOnlineUsers, roomToUsers[roomId]);
}
