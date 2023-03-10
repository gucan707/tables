import { User } from "@tables/types";
import { useState } from "react";

export function useSignIn() {
  const [signInInfo, setSignInInfo] = useState<Omit<User, "_id">>({
    name: "",
    pw: "",
  });

  return { signInInfo, setSignInInfo };
}
