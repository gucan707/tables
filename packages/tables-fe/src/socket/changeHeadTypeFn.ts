import { ChangeHeadTypeArgs } from "@tables/types";

import { setHead } from "../redux/headsSlice";
import { replaceGrids } from "../redux/rowsSlice";
import { store } from "../redux/store";

export const changeHeadTypeFn = (args: ChangeHeadTypeArgs) => {
  const { head } = args;
  store.dispatch(setHead(head));
  store.dispatch(replaceGrids(args));
};
