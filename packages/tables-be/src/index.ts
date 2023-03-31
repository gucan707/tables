import { createServer } from "http";
import Koa from "koa";
import KoaBody from "koa-body";
import logger from "koa-logger";
import { Server } from "socket.io";

import cors from "@koa/cors";

import { handleError } from "./middleware/handleError";
import router from "./router";
import { setup } from "./socket";

const app = new Koa();

const httpServer = createServer(app.callback());

export const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST", "PUT"],
  },
  path: "/socket",
});

// io.on("connection", (socket) => {
//   socket.broadcast.emit("hello", "world");
// });
setup(io);

app
  // .use(logger())
  .use(handleError)
  .use(cors({ credentials: true, origin: "http://127.0.0.1:5173" }))
  .use(KoaBody())
  .use(router.routes())
  .use(router.allowedMethods());

httpServer.listen(8080);

console.log("listen on 8080");
