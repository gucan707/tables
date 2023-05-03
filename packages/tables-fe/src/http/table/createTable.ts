import { ResCreateTable } from '@tables/types';

import { request } from '../request';
import { TABLE_BASE_URL } from '../url';

export async function createTable() {
  return request<ResCreateTable>({
    url: `/${TABLE_BASE_URL}`,
    method: "POST",
  });
}
