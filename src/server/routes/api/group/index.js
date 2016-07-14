import Groups from './groups';
import Group from './group';

export default {
	'/': Groups,
	'/:id': Group,
};
