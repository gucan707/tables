import { Server, Socket } from "socket.io";

import { Events, ReqJoinRoom, UserToken } from "@tables/types";

import { checkToken } from "../utils/checkToken";

export const roomToUsers: Record<string, ({ socketId: string } & UserToken)[]> =
  {};

export async function joinRoom(req: ReqJoinRoom, socket: Socket, io: Server) {
  try {
    const userInfo = checkToken(null, req.jwt);
    console.log("join room ", userInfo._id, socket.id, req.roomNumber);

    await socket.join(req.roomNumber);
    if (!roomToUsers[req.roomNumber]) {
      roomToUsers[req.roomNumber] = [];
    }

    const room = roomToUsers[req.roomNumber];
    const user = room.find((user) => user._id === userInfo._id);
    if (user) {
      user.socketId = socket.id;
    } else {
      room.push({ ...userInfo, socketId: socket.id });
    }

    io.to(req.roomNumber).emit(
      Events.EmitOnlineUsers,
      roomToUsers[req.roomNumber]
    );
  } catch (error) {
    // TODO 或许需要返回报错
    console.error(error);
  }
}
