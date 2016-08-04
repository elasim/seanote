import Board from './board';
import List from './list';
import { combine } from '../utils/routing';

export default combine({
	'/': Board,
	'/:board/lists': List,
});
