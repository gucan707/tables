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
          <>
            Card content <br /> Card content
          </>
        }
      />
    </Card>
  );
};
