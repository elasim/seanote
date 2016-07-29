import Message from './message';
import Notifications from './notification';
import Users from './user';
import Boards from './board';
import Groups from './group';

// @IMPORTANT
//
// DO NOT USE SAME ROUTE PARAMETER NAME ON API URI
//
// Bulk API execute every middlewares simultaneously
// If you use same name on route paramete, It will cause side effects
//
export default {
	...extend('/board', Boards),
	...extend('/group', Groups),
	...extend('/user', Users),
	...extend('/notification', Notifications),
	...extend('/message', Message),
};

function extend(prefix, edges) {
	return Object.assign(
		...Object.keys(edges).map(key => {
			return { [`${prefix}${key}`]: edges[key] };
		})
	);
}
