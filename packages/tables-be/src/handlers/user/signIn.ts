import { ReqSignIn, ResCommon, ResSignIn, UserToken } from "@tables/types";
import { IMiddleware } from "koa-router";
import jwt from "jsonwebtoken";
import { users } from "../../db";
import { TOKEN_SCRETE } from "../../private";

export const signInWithPw: IMiddleware = async (ctx) => {
  const req = ctx.request.body as ReqSignIn;

  const existedUser = await users.findOne({ name: req.name });

  if (!existedUser) {
    ctx.body = {
      status: 401,
      msg: "用户名不存在",
    };
    return;
  }

  if (existedUser.pw !== req.pw) {
    ctx.body = {
      status: 401,
      msg: "密码错误",
    };
    return;
  }

  const userInfo: UserToken = {
    _id: existedUser._id,
    name: req.name,
  };

  const res: ResCommon<ResSignIn> = {
    status: 200,
    msg: "ok",
    data: jwt.sign(userInfo, TOKEN_SCRETE),
  };

  ctx.body = res;
};
