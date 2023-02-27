import Router from "koa-router";
import { createUser } from "../handlers/user/createUser";
import { signInWithPw } from "../handlers/user/signIn";

export const userRouter = new Router();

userRouter.post("/sign", signInWithPw);
userRouter.post("/", createUser);
