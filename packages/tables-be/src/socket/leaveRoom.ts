import { Socket } from "socket.io";

import { Events } from "@tables/types";

import { io } from "../";
import { rows, tables } from "../db";
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

  console.log("roomToUsers[roomId]", roomToUsers[roomId]);

  if (!roomToUsers[roomId].length) {
    delete roomToUsers[roomId];
    console.log("del deleted", roomId);
    delDeletedColumn(roomId);
  }

  io.to(roomId).emit(Events.EmitOnlineUsers, roomToUsers[roomId]);
}

export async function delDeletedColumn(tableId: string) {
  const tableInfo = await tables.findOne({ _id: tableId });
  const deletedHeadIds = tableInfo.heads
    .filter((head) => head.isDeleted)
    .map((head) => head._id);
  tableInfo.heads = tableInfo.heads.filter((h) => !h.isDeleted);
  await Promise.all([
    tables.updateOne({ _id: tableId }, { $set: { heads: tableInfo.heads } }),
    rows.deleteMany({ tableId: tableId, isDeleted: true }),
    rows.updateMany(
      { tableId: tableId },
      {
        $pull: {
          data: {
            headId: { $in: deletedHeadIds },
          },
        },
      }
    ),
  ]);
}
