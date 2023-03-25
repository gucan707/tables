import { IMiddleware } from "koa-router";

import { ResCommon, UserToken } from "@tables/types";

import { checkToken } from "../../utils/checkToken";

export const getUserByToken: IMiddleware = async (ctx) => {
  const userInfo = checkToken(ctx);
  const res: ResCommon<UserToken> = {
    status: 200,
    msg: "ok",
    data: userInfo,
  };

  ctx.body = res;
};
