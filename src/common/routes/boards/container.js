import connect from 'react-redux/lib/components/connect';
import Board from './boards';
import { create, rename, moveTrash } from '../../actions/board';

export default connect(
	state => ({
		items: state.data.boards.list
	}),
	{
		create,
		rename,
		moveTrash,
	}
)(Board);
