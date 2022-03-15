import {
  BarChartOutlined, TagsOutlined, CreditCardOutlined, AccountBookOutlined
} from '@ant-design/icons';
import Dashboard from '../Dashboard';
import Record from '../Record';
import Classification from '../Classification';
import Wallet from '../Wallet';

export default [
  { path: '/', component: Dashboard, icon: BarChartOutlined },
  { path: '/record', component: Record, icon: AccountBookOutlined },
  { path: '/classification', component: Classification, icon: TagsOutlined },
  { path: '/wallet', component: Wallet, icon: CreditCardOutlined }
];
