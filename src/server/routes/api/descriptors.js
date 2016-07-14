import Message from './message';
import Notifications from './notification';
import Users from './user';
import Boards from './board';
import Groups from './group';

export default {
	...extend('/board', Boards),
	...extend('/group', Groups),
	...extend('/user', Users),
	...extend('/notification', Notifications),
	...extend('/message', Message),
};

function extend(prefix, descriptors) {
	return Object.assign(
		...Object.keys(descriptors).map(key => {
			return { [`${prefix}${key}`]: descriptors[key] };
		})
	);
}
