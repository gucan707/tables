import { createServer } from "http";
import Koa from "koa";
import KoaBody from "koa-body";
import logger from "koa-logger";
import { Server } from "socket.io";

import cors from "@koa/cors";
import router from "./router";
import { handleError } from "./middleware/handleError";

const app = new Koa();

const httpServer = createServer(app.callback());

const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:3000",
    methods: ["GET", "POST"],
  },
  path: "foo",
});

app
  .use(logger())
  .use(handleError)
  .use(cors({ credentials: true, origin: "http://localhost:3000" }))
  .use(KoaBody())
  .use(router.routes())
  .use(router.allowedMethods());

httpServer.listen(8080);

console.log("listen on 8080");

export default io;
