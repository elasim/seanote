import connect from 'react-redux/lib/components/connect';
import Board from './boards';
import { create, rename, moveTrash } from '../../actions/board';

export default connect(
	state => ({
		headerVisibility: state.app.headerVisibility,
		board: state.board,
	}),
	{
		create,
		rename,
		moveTrash,
	}
)(Board);