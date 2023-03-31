import {
  MultiSelectOTData,
  Operator,
  OperatorType,
  OpsEmitedFromBeArgs,
  OpsTypeEmitedFromBe,
} from "@tables/types";

export function isStringOpsEmited(
  args: OpsEmitedFromBeArgs<string | MultiSelectOTData>
): args is OpsEmitedFromBeArgs<string> {
  return args.type === OpsTypeEmitedFromBe.Text;
}

export function isTagsOpsEmited(
  args: OpsEmitedFromBeArgs<string | MultiSelectOTData>
): args is OpsEmitedFromBeArgs<MultiSelectOTData> {
  return args.type === OpsTypeEmitedFromBe.MultiSelect;
}

export function isStringOtsEmited(
  args: OpsEmitedFromBeArgs<string>[] | OpsEmitedFromBeArgs<MultiSelectOTData>[]
): args is OpsEmitedFromBeArgs<string>[] {
  for (let arg of args) {
    if (!isStringOpsEmited(arg)) return false;
  }
  return true;
}
