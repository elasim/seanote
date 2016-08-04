import Users from './user';
import Boards from './board';
import Groups from './group';
import Notifications from './notification';
import Messages from './message';
import { combine } from './utils/routing';

// @IMPORTANT
//
// DO NOT USE SAME ROUTE PARAMETER NAME ON API URI
//
// Bulk API execute every middlewares simultaneously
// If you use same name on route paramete, It will cause side effects
//
export default combine({
	'/user': Users,
	'/board': Boards,
	'/group': Groups,
	'/notification': Notifications,
	'/message': Messages,
});
	// ...extend('/board', Boards),
	// ...extend('/group', Groups),
	// ...extend('/user', Users),
	// ...extend('/notification', Notifications),
	// ...extend('/message', Message),
