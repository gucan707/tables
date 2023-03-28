import { ReqPutHeadAttributes } from "@tables/types";

import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export async function putHeadAttributes(req: ReqPutHeadAttributes) {
  const PUT_HEAD_ATTRIBUTES_URL = `/${TABLE_BASE_URL}/${req.tableId}/putHeadAttributes`;

  await request<string, ReqPutHeadAttributes>({
    url: PUT_HEAD_ATTRIBUTES_URL,
    method: "PUT",
    data: req,
  });
}
