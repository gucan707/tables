import "./index.less";

import { FC } from "react";

import { Avatar, Layout } from "@arco-design/web-react";

import { TableCard } from "../../components/TableCard";

export const Home: FC = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Tables</h1>
        <Avatar>A</Avatar>
      </header>
      <div className="home-content">
        <h2>表格总览</h2>
        <div className="home-content-cards">
          <TableCard />
        </div>
      </div>
    </div>
  );
};
