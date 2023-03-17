import { SelectOptionType } from "@tables/types";

export function getMapTags(tags: SelectOptionType[]) {
  const mapTags = new Map<string, SelectOptionType>();
  tags.forEach((tag) => {
    mapTags.set(tag._id, tag);
  });
  return mapTags;
}
