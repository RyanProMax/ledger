import { Routes, Route, useNavigate } from 'react-router-dom';
import routes from './router';
import { Button } from 'antd';

export default () => {
  const navigater = useNavigate();

  return (
    <>
      <div style={{ listStyle: 'none', display: 'flex' }}>
        <Button type="primary" onClick={() => navigater('/')}>
          Home
        </Button>
        <Button type="primary" onClick={() => navigater('/about')}>
          About
        </Button>
      </div>
      <Routes>
        {routes.map((route) => (
          <Route exact key={route.path} path={route.path} element={<route.component />} />
        ))}
      </Routes>
    </>
  );
};
