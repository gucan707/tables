import { Row } from "./grid";
import { TableHeads } from "./tableHead";

export type Table = {
  _id: string;
  title: string;
  heads: TableHeads;
  body: Row[];
  owner: string;
  collaborators: string[];
};
