import { AddRowArgs } from "@tables/types";

import { addRows } from "../redux/rowsSlice";
import { store } from "../redux/store";

export const addRowFn = (args: AddRowArgs) => {
  store.dispatch(addRows([{ ...args.row, createTime: args.createTime }]));
};
