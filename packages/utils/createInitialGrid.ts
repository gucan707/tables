import { Grid, TableColumnTypes } from "@tables/types";

/**
 *
 * @param _id grid id
 * @param headType
 * @param headId
 * @returns
 */
export function createInitialGrid(
  _id: string,
  headType: TableColumnTypes,
  headId: string
): Grid | undefined {
  const common = {
    _id,
    headId,
    version: 0,
  };

  switch (headType) {
    case TableColumnTypes.Checkbox:
      return {
        ...common,
        type: headType,
        checked: false,
      };
    case TableColumnTypes.Date:
      return {
        ...common,
        type: headType,
        date: -1,
      };
    case TableColumnTypes.MultiSelect:
      return {
        type: headType,
        contents: [],
        ...common,
      };
    case TableColumnTypes.Number:
      return {
        type: TableColumnTypes.Number,
        content: 0,
        ...common,
      };
    case TableColumnTypes.Select:
      return {
        ...common,
        type: TableColumnTypes.Select,
        content: "",
      };
    case TableColumnTypes.Text:
      return {
        ...common,
        type: headType,
        text: "",
      };
    default:
      return;
  }
}
