import { ChangeHeadTypeArgs } from "@tables/types";

import { changeHeadType } from "../redux/headsSlice";
import { replaceGrids } from "../redux/rowsSlice";
import { store } from "../redux/store";

export const changeHeadTypeFn = (args: ChangeHeadTypeArgs) => {
  store.dispatch(changeHeadType(args));
  store.dispatch(replaceGrids(args));
};
