import Boards from './boards';
import BoardsRenumber from './boards-renumber';
import Board from './board';

export default {
	'/': Boards,
	'/_renumber': BoardsRenumber,
	'/:board': Board,
};
