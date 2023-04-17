import "./index.less";

import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Modal, Trigger } from "@arco-design/web-react";
import { Table } from "@tables/types";

import { addColumn } from "../../http/table/addColumn";
import { addRow } from "../../http/table/addRow";
import { setHeads } from "../../redux/headsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
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
          {rows.map((row) => (
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
