import Message from './message';
import Notification from './notification';
import User from './user';
import Board from './board';
import BoardList from './board-list';
import GroupList from './group-list';

export default {
	'/message': Message,
	'/notification': Notification,
	'/user': User,
	'/board': Board,
	'/board/list': BoardList,
	'/group/list': GroupList,
};
