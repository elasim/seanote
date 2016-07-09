import _ from 'lodash';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ListAction from '../../actions/list';
import BoardView from './board';

export default _.flow(
	connect(
		state => ({
			items: state.board.items,
			trashItems: state.board.trashItems,
		}),
		dispatch => ({
			action: bindActionCreators({
				fetchData: ListAction.fetchData,
				createCard: ListAction.createCard,
				moveCard: ListAction.moveCard,
				moveCardToTrash: ListAction.moveCardToTrash,
				moveBoard: ListAction.moveBoard,
				moveBoardToTrash: ListAction.moveBoardToTrash,
				setName: ListAction.setName,
				updateCard: ListAction.updateCard,
			}, dispatch)
		})
	),
	withRouter
)(BoardView);
