import { Row } from "./grid";
import { TableHeads } from "./tableHead";

export type Table = {
  _id: string;
  title: string;
  heads: TableHeads;
  rows: Row[];
  owner: string;
  collaborators: string[];
};
