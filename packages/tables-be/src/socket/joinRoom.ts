import { Server, Socket } from "socket.io";

import { Events, ReqJoinRoom } from "@tables/types";

import { checkToken } from "../utils/checkToken";

export async function joinRoom(req: ReqJoinRoom, socket: Socket, io: Server) {
  try {
    const userInfo = checkToken(null, req.jwt);
    console.log("join room ", userInfo._id, socket.id, req.roomNumber);

    await socket.join(req.roomNumber);
    io.to(req.roomNumber).emit(Events.JoinRoom, { userInfo });
  } catch (error) {
    // TODO 或许需要返回报错
    console.error(error);
  }
}