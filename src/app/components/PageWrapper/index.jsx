import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import store from '../../store';

export default function PageWrapper({ children }) {
  return (
    <Provider store={store}>
      <HashRouter>
        {children}
      </HashRouter>
    </Provider>
  );
}
