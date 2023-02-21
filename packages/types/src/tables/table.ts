import { Row } from "./grid";
import { TableHeads } from "./tableHead";

export type Table = {
  id: string;
  heads: TableHeads;
  body: Row[];
  owner: string;
  collaborators: string[];
};
