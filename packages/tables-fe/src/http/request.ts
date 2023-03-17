import axios, { AxiosRequestConfig } from "axios";

import { Message } from "@arco-design/web-react";
import { ResCommon } from "@tables/types";

import { SERVER_BASE_URL } from "./url";

export const JWT_KEY = "GCTables-token";

export function request<T = {}, D = {}>(config: AxiosRequestConfig<D>) {
  const instance = axios.create({
    baseURL: SERVER_BASE_URL,
  });

  instance.interceptors.request.use(
    (config) => {
      const token = window.localStorage.getItem(JWT_KEY);
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token || ""}`;
      return config;
    },
    (err) => {
      console.error(err);
    }
  );

  return new Promise<T | null>(async (resolve) => {
    try {
      const res = await instance.request<ResCommon<T>>(config);
      if (res.data && res.data.status === 200) {
        resolve(res.data.data ?? null);
      } else if (!res.data) {
        throw new Error("出错了！");
      } else {
        console.log(res.data);

        throw new Error(res.data.msg || "出错了！");
      }
    } catch (err) {
      console.error(err);
      err instanceof Error && Message.error(err.message);

      // if (err instanceof Error) {
      //   const id = nanoid();
      //   store.dispatch(addToast({ value: err.message, severity: "error", id }));

      //   setTimeout(() => {
      //     store.dispatch(removeToast(id));
      //   }, 1800);
      // }

      resolve(null);
    }
  });
}
