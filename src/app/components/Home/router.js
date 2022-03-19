import {
  BarChartOutlined, TagsOutlined, CreditCardOutlined, AccountBookOutlined
} from '@ant-design/icons';
import Dashboard from '../Dashboard';
import Record from '../Record';
import Classification from '../Classification';
import Wallet from '../Wallet';

export default [
  {
    path: '/', component: Dashboard, icon: BarChartOutlined, tipText: '总览'
  },
  {
    path: '/record', component: Record, icon: AccountBookOutlined, tipText: '详情'
  },
  {
    path: '/classification', component: Classification, icon: TagsOutlined, tipText: '分类'
  },
  {
    path: '/wallet', component: Wallet, icon: CreditCardOutlined, tipText: '账户'
  }
];
