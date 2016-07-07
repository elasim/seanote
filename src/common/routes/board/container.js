import _ from 'lodash';
import { DropTarget } from 'react-dnd';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BoardAction from '../../actions/board';
import BoardView from './board';

export default _.flow(
	DropTarget(
		['BoardListItem', 'SortableListItem', 'Command'],
		{},
		(connect, monitor) => ({
			connectDropTarget: connect.dropTarget(),
			dragItemType: monitor.getItemType(),
			dragItem: monitor.getItem(),
			sourceClientOffset: monitor.getClientOffset(),
		})
	),
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
