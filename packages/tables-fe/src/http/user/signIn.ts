import { sha256 } from "js-sha256";

import { Message } from "@arco-design/web-react";
import { ReqSignIn, ResSignIn, User } from "@tables/types";

import { request } from "../request";
import { SIGN_IN_URL } from "../url";

export async function signIn(info: Omit<User, "_id">) {
  if (Object.values(info).some((val) => val === "")) {
    Message.error("请完善登录信息");
    return;
  }

  const res = await request<ResSignIn, ReqSignIn>({
    url: SIGN_IN_URL,
    method: "POST",
    data: { name: info.name, pw: sha256(info.pw) },
  });

  if (res) {
    window.localStorage.setItem("GCTables-token", res);
    Message.success("登录成功");
  }

  return res;
}
