import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import ConversationsRoute from './routes/conversations.route';
import FriendsRoute from './routes/friends.route';
import MessagesRoute from './routes/messages.route';
import RolesRoute from './routes/roles.route';

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new RolesRoute(),
  new FriendsRoute(),
  new ConversationsRoute(),
  new MessagesRoute(),
]);

app.listen();
