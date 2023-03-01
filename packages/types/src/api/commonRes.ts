export type ResCommon<T = undefined> = {
  status: number;
  msg?: string;
  data: T;
};
