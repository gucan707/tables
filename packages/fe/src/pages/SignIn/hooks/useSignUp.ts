import { User } from "@tables/types";
import { checkUsername } from "@tables/utils";
import { useState } from "react";

export type SignUpInfo = Pick<User, "name" | "pw"> & { repeatPw: string };

export function useSignUp() {
  const initial: SignUpInfo = {
    name: "",
    pw: "",
    repeatPw: "",
  };

  const [signUpInfo, _setSignUpInfo] = useState<SignUpInfo>(initial);
  const [errorMsg, _setErrorMsg] = useState<SignUpInfo>(initial);

  const setName = (name: string) => {
    const err = checkUsername(name);
    // const err = "1";
    _setSignUpInfo({ ...signUpInfo, name });
    _setErrorMsg({ ...errorMsg, name: err || "" });
  };

  const setPw = (pw: string) => {
    if (
      pw.length > 15 ||
      pw.length < 6 ||
      !(/\d/.test(pw) && /[a-zA-Z]/.test(pw))
    ) {
      _setErrorMsg({
        ...errorMsg,
        pw: "密码需6～15位，且至少包含数字与英文字母",
      });
    }
    _setSignUpInfo({ ...signUpInfo, pw });
  };

  const setRepeatPw = (pw: string) => {
    if (pw !== signUpInfo.pw) {
      _setErrorMsg({ ...errorMsg, repeatPw: "两次密码不一致" });
    }
    _setSignUpInfo({ ...signUpInfo, repeatPw: pw });
  };

  return { signUpInfo, setName, errorMsg, setPw, setRepeatPw };
}
