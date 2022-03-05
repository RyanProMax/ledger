import Record from '../Record';
import Classification from '../Classification';
import { UnorderedListOutlined, FormOutlined } from '@ant-design/icons';

export const routes = [
  { path: '/', component: Record, icon: FormOutlined },
  { path: '/classification', component: Classification, icon: UnorderedListOutlined }
];
