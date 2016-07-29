import query from './query';
import user from './user';
import token from './token';

export default {
	'/': query,
	'/token': token,
	'/:user': user,
};
