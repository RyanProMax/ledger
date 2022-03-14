import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../components/Home';
import PageWrapper from '../../components/PageWrapper';
import 'antd/dist/antd.css';
import './index.less';

ReactDOM.render(
  <PageWrapper>
    <App />
  </PageWrapper>,
  document.getElementById('root')
);
