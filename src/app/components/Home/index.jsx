import { Route, Routes } from 'react-router-dom';
import Menu from '../Menu';
import TitleBar from '../TitleBar';
import './index.less';
import routes from './router';

export default function Home() {
  return (
    <>
      <TitleBar />
      <div className="ledger-home">
        <Menu route={routes} />
        <div className="ledger-home-content-wrapper">
          <div className="ledger-home-content">
            <Routes>
              {routes.map((r, i) => (
                <Route key={i} path={r.path} element={<r.component />} />
              ))}
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}
