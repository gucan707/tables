import "./index.less";

import { FC } from "react";
import { useParams } from "react-router-dom";

import { Avatar, Button, Spin } from "@arco-design/web-react";

import { EditableTable } from "../../components/EditableTable";
import { useTableDetail } from "../../http/table/useTableDetail";

const AvatarGroup = Avatar.Group;

export const Table: FC = () => {
  const { tableId } = useParams();
  const { tableDetail } = useTableDetail({ tableId: tableId || "" });

  return (
    <div className="table">
      <header className="table-header">
        <Button type="outline">管理协作者</Button>
        <AvatarGroup size={32} style={{ margin: 10 }}>
          <Avatar style={{ backgroundColor: "#7BC616" }}>A</Avatar>
          <Avatar style={{ backgroundColor: "#14C9C9" }}>B</Avatar>
          <Avatar style={{ backgroundColor: "#168CFF" }}>C</Avatar>
          <Avatar style={{ backgroundColor: "#FF7D00" }}>Arco</Avatar>
          <Avatar style={{ backgroundColor: "#FFC72E" }}>Design</Avatar>
        </AvatarGroup>
        <Avatar>A</Avatar>
      </header>
      <div className="table-content">
        <div className="table-content-title">学习计划</div>
        {tableDetail ? <EditableTable table={tableDetail} /> : <Spin />}
      </div>
    </div>
  );
};
