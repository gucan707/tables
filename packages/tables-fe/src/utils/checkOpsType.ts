import {
  MultiSelectOTData,
  Operator,
  OperatorType,
  OpsEmitedFromBeArgs,
} from "@tables/types";

export function isStringOps(
  ops: Operator<string | MultiSelectOTData>[]
): ops is Operator<string>[] {
  return ops.every((op) => {
    if (op.type !== OperatorType.Insert) return true;
    if (typeof op.data === "string") return true;
    else return false;
  });
}

export function isStringOpsEmited(
  args: OpsEmitedFromBeArgs<string | MultiSelectOTData>
): args is OpsEmitedFromBeArgs<string> {
  return isStringOps(args.ops);
}

export function isTagsOpsEmited(
  args: OpsEmitedFromBeArgs<string | MultiSelectOTData>
): args is OpsEmitedFromBeArgs<MultiSelectOTData> {
  return !isStringOpsEmited(args);
}

export function isStringOtsEmited(
  args: OpsEmitedFromBeArgs<string>[] | OpsEmitedFromBeArgs<MultiSelectOTData>[]
): args is OpsEmitedFromBeArgs<string>[] {
  for (let arg of args) {
    if (!isStringOpsEmited(arg)) return false;
  }
  return true;
}
