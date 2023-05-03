import './index.less';

import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Avatar, Button, Empty, Layout, Tabs } from '@arco-design/web-react';

import { ReadonlyTable } from '../../components/ReadonlyTable';
import { TableCard } from '../../components/TableCard';
import { createTable } from '../../http/table/createTable';
import { useTables } from '../../http/table/useTables';
import { useUserInfo } from '../../http/user/useUserInfo';

const TabPane = Tabs.TabPane;

export const Home: FC = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get("page"));
  const page = Number(searchParams.get("page"));
  const { userInfo } = useUserInfo();
  const { loading, tables } = useTables({ page: page || 0 });

  return (
    <div className="home">
      <header className="home-header">
        <h1>表格总览</h1>
        <Avatar>{userInfo?.name}</Avatar>
      </header>
      <div className="home-content">
        <div>
          <Button
            type="primary"
            style={{ margin: "10px 0" }}
            onClick={() => {
              createTable();
            }}
          >
            创建表格
          </Button>
        </div>
        <Tabs defaultActiveTab="1">
          <TabPane title="我创建的" key="1">
            <div className="home-content-cards">
              {tables?.map((table) => (
                <TableCard key={table._id} table={table} />
              ))}
            </div>
          </TabPane>
          <TabPane title="我参与的" key="2">
            <Empty />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
