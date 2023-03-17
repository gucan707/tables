import { SelectOptionType, TableColumnTypes, TableHeads } from "@tables/types";

export function getMapTags(heads: TableHeads) {
  const tags: SelectOptionType[] = [];
  heads.forEach((head) => {
    if (
      head.type === TableColumnTypes.MultiSelect ||
      head.type === TableColumnTypes.Select
    ) {
      head.tags && tags.push(...head.tags);
    }
  });
  const mapTags = new Map<string, SelectOptionType>();
  tags.forEach((tag) => {
    mapTags.set(tag._id, tag);
  });
  return mapTags;
}
