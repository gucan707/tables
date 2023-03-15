import { FC } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export const Table: FC = () => {
  const { tableId } = useParams();
  console.log({ tableId });

  return <div>table</div>;
};
