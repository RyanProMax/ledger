import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../components/Home';
import PageWrapper from '../../components/PageWrapper';
import './index.less';

ReactDOM.render(
  <PageWrapper>
    <App />
  </PageWrapper>,
  document.getElementById('root')
);
