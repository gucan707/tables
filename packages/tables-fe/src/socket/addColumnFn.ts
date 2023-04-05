import { AddColumnArgs } from "@tables/types";

import { addHead } from "../redux/headsSlice";
import { addColumn } from "../redux/rowsSlice";
import { store } from "../redux/store";

export const addColumnFn = (args: AddColumnArgs) => {
  store.dispatch(addColumn(args));
  store.dispatch(addHead(args.head));
};
