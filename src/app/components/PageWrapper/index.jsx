import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import store from '../../store';

export default function PageWrapper({ children }) {
  return (
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <HashRouter>
          {children}
        </HashRouter>
      </Provider>
    </ConfigProvider>
  );
}
