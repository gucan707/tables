export enum OperatorType {
  Insert,
  Delete,
  Retain,
}
export type Operator<T> =
  | {
      type: OperatorType.Delete | OperatorType.Retain;
      count: number;
      data?: never;
    }
  | {
      type: OperatorType.Insert;
      count?: never;
      data: T extends string ? T : T[];
    };

export type MultiSelectOTData = { tagId: string };
