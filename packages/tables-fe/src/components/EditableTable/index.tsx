import "./index.less";

import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Modal, Trigger } from "@arco-design/web-react";
import { Grid, Row, Table } from "@tables/types";
import { createInitialGrid } from "@tables/utils";

import { addColumn } from "../../http/table/addColumn";
import { addRow } from "../../http/table/addRow";
import { setHeads } from "../../redux/headsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { createInitialRow } from "../../utils/createInitialRow";
import { getMapTags } from "../../utils/getMapTags";
import { EditableTableRow } from "../EditableTableRow";
import { HeadAttributes } from "../HeadAttributes";
import { HeadConfigModal } from "../HeadConfigModal";
import { TableIcon } from "../TableIcon";

export type EditableTableProps = {
  className?: string;
  table: Table;
};

export const EditableTable: FC<EditableTableProps> = (props) => {
  const { className = "", table } = props;
  const { heads, rows } = table;
  const dispatch = useAppDispatch();
  const headsRedux = useAppSelector((state) => state.headsReducer.heads);
  const [activeHead, setActiveHead] = useState("");
  const { tableId = "" } = useParams();
  const rowRedux = useAppSelector((state) => state.rowsReducer.rows);
  const [curRows, setCurRows] = useState<Omit<Row, "tableId">[]>(rows);

  useEffect(() => {
    if (!rows || !rowRedux || !heads) return;
    const rowsIds = Object.keys(rowRedux);
    const newCurRows: Omit<Row, "tableId">[] = [];
    rowsIds.forEach((rowId) => {
      const row = rows.find((r) => r._id === rowId);
      const rowReduxData = rowRedux[rowId];

      // 初始数据中不存在该列，说明为新加的一列，直接初始化一列插入
      if (!row) {
        const initialRow = createInitialRow({
          dataInfo: rowReduxData,
          heads,
          rowId,
        });
        newCurRows.push(initialRow);
        return;
      }

      // 初始数据与当前redux中均存在该列，需要逐一对比每一个格子
      const grids: Grid[] = [];
      rowReduxData.forEach((grid) => {
        const head = heads.find((h) => h._id === grid.headId);
        // 没有对应的 head，直接忽略
        if (!head) return;

        const exited = row.data.find((g) => g._id === grid.gridId);
        // 初始数据与当前 redux 中均存在该格子，直接保留
        if (exited) {
          grids.push(exited);
          return;
        }

        // redux 中存在该格子而初始数据中不存在，视为新增的格子
        const newGrid = createInitialGrid(grid.gridId, head.type, head._id);
        newGrid && grids.push(newGrid);
      });

      newCurRows.push({ _id: rowId, data: grids });
    });

    setCurRows(newCurRows);
  }, [rows, rowRedux, heads]);

  useEffect(() => {
    dispatch(setHeads(heads));
  }, [heads]);

  const tags = getMapTags(heads);

  return (
    <div className={`editable table-container ${className}`}>
      <table className="editable table">
        <thead className="editable table-heads">
          <tr>
            {headsRedux.map((head) => (
              <Trigger
                popup={() => (
                  <HeadAttributes head={head} setActiveHead={setActiveHead} />
                )}
                trigger="click"
                position="bottom"
                classNames="zoomInTop"
                key={head._id}
              >
                <th className="editable table-heads-item grid_common">
                  <TableIcon
                    type={head.type}
                    className="editable table-heads-item-icon"
                  />
                  {head.name}
                </th>
              </Trigger>
            ))}
            <th
              className="editable table-heads-item grid_common grid_add"
              onClick={() => {
                addColumn({ tableId });
              }}
            >
              +
            </th>
          </tr>
        </thead>
        <tbody>
          {curRows.map((row) => (
            <EditableTableRow
              heads={headsRedux}
              row={row}
              key={row._id}
              tags={tags}
            />
          ))}
          <tr
            className="editable table-add_row"
            onClick={() => {
              addRow({ tableId });
            }}
          >
            <td
              colSpan={heads.length + 1}
              className="editable table-add_row-td"
            >
              +
            </td>
          </tr>
        </tbody>
      </table>
      <HeadConfigModal activeHead={activeHead} setActiveHead={setActiveHead} />
    </div>
  );
};
