import Board from './board';
import List from './list';
import Card from './card';
import { combine } from '../utils/routing';

export default combine({
	'/': Board,
	'/:board/lists': List,
	'/:board/lists/:list/cards': Card,
});
