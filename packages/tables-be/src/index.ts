import { createServer } from "http";
import Koa from "koa";
import KoaBody from "koa-body";
import logger from "koa-logger";
import { Server } from "socket.io";

import cors from "@koa/cors";

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
  .use(cors({ credentials: true, origin: "http://localhost:3000" }))
  .use(KoaBody())
  .use((ctx) => {
    console.log(ctx.request.body);
    ctx.body = "1234";
  });

httpServer.listen(3011);

console.log("listen on 3011");

export default io;
