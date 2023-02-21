"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var http_1 = require("http");
var koa_1 = __importDefault(require("koa"));
var koa_body_1 = __importDefault(require("koa-body"));
var koa_logger_1 = __importDefault(require("koa-logger"));
var socket_io_1 = require("socket.io");
var cors_1 = __importDefault(require("@koa/cors"));
var app = new koa_1["default"]();
var httpServer = (0, http_1.createServer)(app.callback());
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:3000",
        methods: ["GET", "POST"]
    },
    path: "foo"
});
app
    .use((0, koa_logger_1["default"])())
    .use((0, cors_1["default"])({ credentials: true, origin: "http://localhost:3000" }))
    .use((0, koa_body_1["default"])())
    .use(function (ctx) {
    console.log(ctx.request.body);
    ctx.body = "gcc";
});
httpServer.listen(3011);
console.log("listen on 3011");
exports["default"] = io;
//# sourceMappingURL=index.js.map