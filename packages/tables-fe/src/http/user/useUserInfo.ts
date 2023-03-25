import useSWR from "swr";

import { UserToken } from "@tables/types";

import { request } from "../request";
import { GET_USER_INFO_URL } from "../url";

export function useUserInfo() {
  const { data } = useSWR(GET_USER_INFO_URL, () => getUserInfo());

  return {
    userInfo: data,
  };
}

export async function getUserInfo() {
  const res = await request<UserToken>({
    url: GET_USER_INFO_URL,
    method: "GET",
  });

  return res;
}
