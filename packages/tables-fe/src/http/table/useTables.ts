import useSWR from "swr";

import { ReqGetTables, ResGetTables } from "@tables/types";

import { request } from "../request";
import { GET_TABLES_URL } from "../url";

export function useTables(req: ReqGetTables) {
  const { data } = useSWR(GET_TABLES_URL, () => getTables(req));
  return {
    tables: data,
    loading: data === undefined,
  };
}

export async function getTables(req: ReqGetTables) {
  const res = await request<ResGetTables>({
    url: GET_TABLES_URL,
    method: "GET",
    params: req,
  });

  return res;
}
