import Router from "koa-router";
import { createUser } from "../handlers/user/createUser";

export const userRouter = new Router();

userRouter.post("/", createUser);
