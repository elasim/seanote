import Boards from './boards';
import Board from './board';

export default {
	'/': Boards,
	'/:board': Board,
};
