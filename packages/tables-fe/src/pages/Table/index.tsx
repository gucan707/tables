import "./index.less";

import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Avatar, Button, Spin } from "@arco-design/web-react";
import { Events, OpsEmitedFromBeArgs, User, UserToken } from "@tables/types";

import { EditableTable } from "../../components/EditableTable";
import { useTableDetail } from "../../http/table/useTableDetail";
import { pushOT } from "../../redux/shouldAppliedOTSlice";
import { useAppDispatch } from "../../redux/store";
import { setup, socket } from "../../socket";
import { OTController } from "../../utils/OTsController";

const AvatarGroup = Avatar.Group;

export const Table: FC = () => {
  const { tableId } = useParams();
  const { tableDetail, tableDetailCopyRef } = useTableDetail({
    tableId: tableId || "",
  });
  const [onlineUsers, setOnlineUsers] = useState<UserToken[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!tableId) return;
    OTController.current = new OTController();
    setup(tableId);
    socket.on(Events.EmitOnlineUsers, (users: UserToken[]) => {
      setOnlineUsers(users);
    });
  }, [tableId]);

  useEffect(() => {
    // TODO 类型
    const OpsEmitedFromBeFn = (args: OpsEmitedFromBeArgs<string>) => {
      console.log("Events.OpsEmitedFromBe", args);

      const { unAppliedOT } = OTController;
      if (!unAppliedOT[args.gridId]) {
        unAppliedOT[args.gridId] = [];
      }
      const curGrid = tableDetailCopyRef?.current?.rows
        .find((row) => row._id === args.rowId)
        ?.data.find((grid) => grid._id === args.gridId);

      if (!curGrid) {
        // TODO 可能是新增的格子，表格层面协同时需要再修改
        console.error("Events.OpsEmitedFromBe: !curGrid");

        return;
      }

      const ots = unAppliedOT[args.gridId];
      ots.push(args);
      ots.sort((a, b) => a.oldVersion - b.oldVersion);
      if (ots[0].oldVersion !== curGrid.version) {
        console.log(ots[0].oldVersion, curGrid.version);

        // 版本不连续，缺少了一些修改
        console.warn(
          "Events.OpsEmitedFromBe: ots[0].oldVersion !== curGrid.version"
        );

        return;
      }

      let index = 1;
      while (index < ots.length) {
        if (ots[index].oldVersion === ots[index - 1].oldVersion + 1) {
          index++;
        } else {
          break;
        }
      }
      curGrid.version = ots[index - 1].oldVersion + 1;
      const shouldAppliedOT = ots.splice(0, index);

      dispatch(
        pushOT({
          gridId: curGrid._id,
          ots: shouldAppliedOT,
        })
      );
    };
    socket.on(Events.OpsEmitedFromBe, OpsEmitedFromBeFn);

    return () =>
      socket.off(Events.OpsEmitedFromBe, OpsEmitedFromBeFn) && undefined;
  }, [tableDetail, socket]);

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
