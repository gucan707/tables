import { ChangeHeadTypeArgs } from "@tables/types";

import { changeHeadType } from "../redux/headsSlice";
import { addColumn, delColumn } from "../redux/rowsSlice";
import { store } from "../redux/store";

export const changeHeadTypeFn = (args: ChangeHeadTypeArgs) => {
  store.dispatch(changeHeadType(args));
  // store.dispatch(replaceGrids(args));
  store.dispatch(addColumn({ added: args.newGrids, head: args.head }));
  store.dispatch(delColumn({ headId: args.oldHeadId }));
};
