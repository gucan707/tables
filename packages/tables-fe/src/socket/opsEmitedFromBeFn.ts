import { MutableRefObject } from "react";

import { MultiSelectOTData, OpsEmitedFromBeArgs, Table } from "@tables/types";

import { pushOT, pushTagsOT } from "../redux/shouldAppliedOTSlice";
import { store } from "../redux/store";
import {
  isStringOpsEmited,
  isStringOtsEmited,
  isTagsOpsEmited,
} from "../utils/checkOpsType";
import { OTController } from "../utils/OTsController";
import { TagsOTController } from "../utils/tagsOTController";

export const opsEmitedFromBeFn = (
  args: OpsEmitedFromBeArgs<string | MultiSelectOTData>
) => {
  console.log("Events.OpsEmitedFromBe", args);

  if (isStringOpsEmited(args)) {
    store.dispatch(
      pushOT({
        gridId: args.gridId,
        ots: args,
      })
    );
  } else if (isTagsOpsEmited(args)) {
    store.dispatch(
      pushTagsOT({
        gridId: args.gridId,
        ots: args,
      })
    );
  }
};
