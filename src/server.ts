import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import RolesRoute from './routes/roles.route';
import FriendsRoute from './routes/friends.route';
import ConversationsRoute from './routes/conversations.route';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new RolesRoute(), new FriendsRoute(), new ConversationsRoute()]);

app.listen();
