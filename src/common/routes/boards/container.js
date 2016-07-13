import connect from 'react-redux/lib/components/connect';
import Board from './boards';
import { setDim } from '../../actions/app';
import { create, rename, sort, moveTrash } from '../../actions/board';

export default connect(
	state => ({
		headerVisibility: state.app.headerVisibility,
		board: state.board,
	}),
	{
		create,
		rename,
		sort,
		moveTrash,
		setDim
	}
)(Board);