import { SignUpInfo } from "../../pages/SignIn/hooks/useSignUpInfo";
import { SIGN_UP_URL } from "../url";
import { Message } from "@arco-design/web-react";
import { request } from "../request";
import { ReqCreateUser, ResCreateUser } from "@tables/types";

export async function signUp(
  info: Omit<SignUpInfo, "repeatPw">,
  err: SignUpInfo
) {
  let hasErr = false;
  Object.values(err).forEach((e) => {
    if (e) {
      Message.error(e);
      hasErr = true;
    }
  });

  if (hasErr) return;

  if (Object.values(info).some((val) => val === "")) {
    Message.error("请完善注册信息");
    return;
  }

  const res = await request<ResCreateUser, ReqCreateUser>({
    url: SIGN_UP_URL,
    method: "POST",
    data: { name: info.name, pw: info.pw },
  });

  res && Message.success("注册成功！");

  return res;
}
