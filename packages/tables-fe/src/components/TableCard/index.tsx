import "./index.less";

import { FC } from "react";

import { Card } from "@arco-design/web-react";

import { ReadonlyTable } from "../ReadonlyTable";

const Meta = Card.Meta;

export const TableCard: FC = () => {
  return (
    <Card
      hoverable
      className="table_card"
      cover={
        <div className="table_card-cover">
          <ReadonlyTable className="table_card-cover-mini_table" />
        </div>
      }
    >
      <Meta
        title="Card Title"
        description={
          <div>
            上次修改：2022/01/01 <br /> 创建于：2020/01/01
          </div>
        }
      />
    </Card>
  );
};
