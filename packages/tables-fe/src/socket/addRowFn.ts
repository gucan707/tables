import { AddRowArgs } from "@tables/types";

import { addRows } from "../redux/rowsSlice";
import { store } from "../redux/store";

export const addRowFn = (args: AddRowArgs) => {
  console.log("addRowFn", args);

  store.dispatch(addRows([args.row]));
};
