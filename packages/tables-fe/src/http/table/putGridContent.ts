import { ReqPutGridContent } from "@tables/types";

import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export async function putGridContent(req: ReqPutGridContent) {
  const PUT_GRID_DATA_URL = `${TABLE_BASE_URL}/${req.tableId}/putGridContent`;
  await request<string, ReqPutGridContent>({
    url: PUT_GRID_DATA_URL,
    method: "PUT",
    data: req,
  });
}
