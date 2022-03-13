import { Spin } from 'antd';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Menu from '../Menu';
import TitleBar from '../TitleBar';
import './index.less';
import routes from './router';

export default function Home() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <TitleBar />
      <div className="ledger-home">
        <Menu route={routes} />
        <div className="ledger-home-content-wrapper">
          <div className="ledger-home-content">
            <Routes>
              {routes.map((r, i) => (
                <Route
                  key={i}
                  path={r.path}
                  element={(
                    <Spin spinning={loading}>
                      <r.component loading={loading} setLoading={setLoading} />
                    </Spin>
                  )}
                />
              ))}
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}
