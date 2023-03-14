import "./index.less";

import { FC } from "react";
import { useSearchParams } from "react-router-dom";

import { Avatar, Layout } from "@arco-design/web-react";

import { ReadonlyTable } from "../../components/ReadonlyTable";
import { TableCard } from "../../components/TableCard";
import { useTables } from "../../http/table/useTables";

export const Home: FC = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get("page"));
  const page = Number(searchParams.get("page"));
  const { loading, tables } = useTables({ page: page || 0 });

  return (
    <div className="home">
      <header className="home-header">
        <h1>Tables</h1>
        <Avatar>A</Avatar>
      </header>
      <div className="home-content">
        <h2>表格总览</h2>
        <div className="home-content-cards">
          {tables?.map((table) => (
            <TableCard key={table._id} tables={tables} />
          ))}
        </div>
        {tables?.map((table) => (
          <ReadonlyTable key={table._id} tables={tables} />
        ))}
      </div>
    </div>
  );
};
