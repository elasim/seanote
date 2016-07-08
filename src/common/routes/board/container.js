import _ from 'lodash';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BoardAction from '../../actions/board';
import BoardView from './board';

export default _.flow(
	connect(
		state => ({
			items: state.board.items,
			trashItems: state.board.trashItems,
		}),
		dispatch => ({
			action: bindActionCreators({
				fetchData: BoardAction.fetchData,
				createCard: BoardAction.createCard,
				moveCard: BoardAction.moveCard,
				moveCardToTrash: BoardAction.moveCardToTrash,
				moveBoard: BoardAction.moveBoard,
				moveBoardToTrash: BoardAction.moveBoardToTrash,
				setName: BoardAction.setName,
				updateCard: BoardAction.updateCard,
			}, dispatch)
		})
	),
	withRouter
)(BoardView);
