import "./index.less";

import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Avatar, Button, Spin } from "@arco-design/web-react";
import { Events, OpsEmitedFromBeArgs, User, UserToken } from "@tables/types";

import { EditableTable } from "../../components/EditableTable";
import { useTableDetail } from "../../http/table/useTableDetail";
import { setup, socket } from "../../socket";
import { OTController } from "../../utils/OTsController";

const AvatarGroup = Avatar.Group;

export const Table: FC = () => {
  const { tableId } = useParams();
  const { tableDetail } = useTableDetail({ tableId: tableId || "" });
  const [rows, setRows] = useState(tableDetail?.rows || []);
  const [onlineUsers, setOnlineUsers] = useState<UserToken[]>([]);

  useEffect(() => {
    if (!tableId) return;
    OTController.current = new OTController();
    setup(tableId);
    socket.on(Events.EmitOnlineUsers, (users: UserToken[]) => {
      setOnlineUsers(users);
    });
    // TODO 类型
    socket.on(Events.OpsEmitedFromBe, (args: OpsEmitedFromBeArgs<string>) => {
      OTController.unAppliedOT.push(args);
      // console.log(OTController.unAppliedOT);
    });
  }, [tableId]);

  useEffect(() => {
    if (!tableDetail) return;
    setRows(tableDetail.rows);
  }, [tableDetail]);

  return (
    <div className="table">
      <header className="table-header">
        <Button type="outline">管理协作者</Button>
        <AvatarGroup size={32} style={{ margin: 10 }}>
          {onlineUsers.map((user) => (
            <Avatar key={user._id} style={{ backgroundColor: "#7BC616" }}>
              {user.name.slice(0, 1)}
            </Avatar>
          ))}
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
