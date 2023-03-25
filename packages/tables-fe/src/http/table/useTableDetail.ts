import { useEffect, useRef } from "react";
import useSWR from "swr";

import { ReqGetTableDetail, ResGetTableDetail, Table } from "@tables/types";

import { deepClone } from "../../utils/deepClone";
import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export function useTableDetail(req: ReqGetTableDetail) {
  const GET_TABLE_DETAIL_URL = `/${TABLE_BASE_URL}/${req.tableId}`;

  const { data } = useSWR(GET_TABLE_DETAIL_URL, () =>
    getTableDetail(GET_TABLE_DETAIL_URL, req)
  );

  /** 仅用于 Table Page check version 的工具 */
  const tableDetailCopyRef = useRef<Table>();

  useEffect(() => {
    const tableDetailCopy = {} as unknown as Table;
    if (data) {
      deepClone(data, tableDetailCopy);
    }
    tableDetailCopyRef.current = tableDetailCopy;
  }, [data]);

  return {
    tableDetail: data,
    tableDetailCopyRef: data && tableDetailCopyRef,
    loading: data === undefined,
  };
}

export async function getTableDetail(url: string, req: ReqGetTableDetail) {
  if (!req.tableId) return;
  const res = await request<ResGetTableDetail>({
    url,
    method: "GET",
  });

  return res;
}
