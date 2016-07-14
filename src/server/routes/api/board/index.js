import Boards from './boards';
import Board from './board';
import List from './list';
import Card from './card';

export default {
	'/': Boards,
	'/:board': Board,
	'/:board/:list': List,
	'/:board/:list/:card': Card,
};
