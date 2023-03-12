import { FC } from "react";

import { ReadonlyTable } from "../../components/ReadonlyTable";
import { TableCard } from "../../components/TableCard";

export const Home: FC = () => {
  return (
    <div>
      <TableCard />
      <ReadonlyTable />
    </div>
  );
};
