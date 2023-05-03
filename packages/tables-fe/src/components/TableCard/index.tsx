import './index.less';

import dayjs from 'dayjs';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card } from '@arco-design/web-react';
import { Table } from '@tables/types';

import { ReadonlyTable } from '../ReadonlyTable';

const Meta = Card.Meta;

export type TableCardProps = {
  table: Table;
};

export const TableCard: FC<TableCardProps> = (props) => {
  const { table } = props;
  const navigate = useNavigate();
  return (
    <Card
      hoverable
      onClick={() => navigate(`/table/${table._id}`)}
      className="table_card"
      cover={
        <div className="table_card-cover">
          <ReadonlyTable
            className="table_card-cover-mini_table"
            table={table}
          />
        </div>
      }
    >
      <Meta
        title={table.title}
        description={
          table.createTime ? (
            <div>创建于：{dayjs(table.createTime).format("YYYY/MM/DD")}</div>
          ) : (
            <></>
          )
        }
      />
    </Card>
  );
};
