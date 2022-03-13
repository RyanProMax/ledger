import { UnorderedListOutlined, FormOutlined, WalletOutlined } from '@ant-design/icons';
import Record from '../Record';
import Classification from '../Classification';
import Wallet from '../Wallet';

export default [
  { path: '/', component: Record, icon: FormOutlined },
  { path: '/classification', component: Classification, icon: UnorderedListOutlined },
  { path: '/wallet', component: Wallet, icon: WalletOutlined }
];
