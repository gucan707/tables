import { ResCommon } from "@tables/types";
import { IMiddleware } from "koa-router";
import { TError } from "../utils/errors";

export const handleError: IMiddleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof TError) {
      const { msg, status } = JSON.parse(error.message) as ResCommon;
      ctx.body = { msg, status };
      ctx.status = 200;
    } else {
      console.error(error);
      ctx.body = {
        msg: "未知错误",
        status: 500,
      };
    }
  }
};
