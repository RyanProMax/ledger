import { UnorderedListOutlined, FormOutlined } from '@ant-design/icons';
import Record from '../Record';
import Classification from '../Classification';

export default [
  { path: '/', component: Record, icon: FormOutlined },
  { path: '/classification', component: Classification, icon: UnorderedListOutlined }
];
