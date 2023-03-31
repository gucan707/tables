import { MultiSelectOTData } from "@tables/types";

export function strArrToMultiSelectDataArr(ids: string[]): MultiSelectOTData[] {
  return ids.map((id) => ({ tagId: id }));
}

export function multiSelectDataArrToStrArr(
  idObjs: MultiSelectOTData[]
): string[] {
  return idObjs.map((idObj) => idObj.tagId);
}
