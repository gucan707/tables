import './index.less';

import { FC } from 'react';

import { SelectOptionType, Table } from '@tables/types';

import { fakeTables, fakeTags } from '../../data/tables';
import { getMapTags } from '../../utils/getMapTags';
import { ReadonlyTableRow } from '../ReadonlyTableRow';
import { TableIcon } from '../TableIcon';

export type ReadonlyTableProps = {
  className?: string;
  table: Table;
};

export const ReadonlyTable: FC<ReadonlyTableProps> = (props) => {
  const { className = "", table } = props;
  const { heads, rows } = table;

  const tags = getMapTags(heads);

  return (
    <div className={`readonly table-container ${className}`}>
      <table className="readonly table">
        <thead className="readonly table-heads">
          <tr>
            {heads.slice(0, 3).map((head) => (
              <th
                key={head._id}
                className="readonly table-heads-item grid_common"
              >
                <TableIcon
                  type={head.type}
                  className="readonly table-heads-item-icon"
                />
                {head.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <ReadonlyTableRow
              heads={heads.slice(0, 3)}
              row={row}
              key={row._id}
              tags={tags}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
