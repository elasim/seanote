import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { connect } from 'react-redux';
import { DragDropContext, DropTarget } from 'react-dnd';
import { browserHistory } from 'react-router';
import TouchBackend from 'react-dnd-touch-backend';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from 'react-mdl';

import './style.scss';

import Item from './item';
import PreviewItem from './preview';
import FABButtonBuilder from '../../components/fab-button-ex';

import Board from '../../models/board';


const mapDropSpecToProps = {
	/*
	drop(props, monitor, component) {
		const dropOffset = monitor.getClientOffset();
		const initialOffset = monitor.getInitialSourceClientOffset();
		const dragData = monitor.getItem();
		const { items } = component.state;
		// Double check this state variable
		// It should have to exist if the component was initialized properly
		// However, To ensure work without error.
		const positions = _.clone(component.state.positions);
		if (!positions) {
			return;
		}

		const dropItemIndex = items.findIndex(item => item.name === dragData.name);
		const rect = {
			width: 206,
			height: 206,
		};
		const current = {
			left: Math.floor((dropOffset.x - initialOffset.x) / rect.width) * rect.width,
			top: Math.floor((dropOffset.y - initialOffset.y) / rect.height) * rect.height,
			drop: true
		};
		positions.splice(dropItemIndex, 1);
		positions.push(current);
		const newItemOrder = [];
		positions.sort((a, b) => {
			const offsetA = a.drop ? dropOffset.y % rect.width : rect.width / 2;
			const offsetB = b.drop ? dropOffset.y % rect.width : rect.width / 2;
			const scoreA = (a.top << 8) | (a.left + offsetA);
			const scoreB = (b.top << 8) | (b.left + offsetB);
			return scoreA - scoreB;
		})
		.map(item => {
			const sortIdx = component.state.positions.indexOf(item);
			return sortIdx === -1 ? dropItemIndex : sortIdx;
		})
		.forEach((idx, i) => newItemOrder[i] = items[idx]);
		component.setState({
			items: newItemOrder
		});
		component.adjustBoardPositions();
	}
	*/
};

function mapDropCollectToProps(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		canDrop: monitor.canDrop(),
		isOver: monitor.isOver({ shallow: true }),
		dragItemType: monitor.getItemType(),
	};
}

const FABButton = FABButtonBuilder('BoardDetailItem');



@connect(null, (dispatch) => ({
	setTitle(title) {
		dispatch({ type: 'setTitle', payload: title });
	},
	setContextMenu(contextMenu) {
		dispatch({ type: 'setContextMenu', payload: contextMenu });
	}
}))
@DragDropContext(TouchBackend({ enableMouseEvents: true }))
@DropTarget('BoardDetailItem', mapDropSpecToProps, mapDropCollectToProps)
export default class BoardDetailView extends Component {
	static propTypes = {
		params: PropTypes.shape({
			id: PropTypes.string.isRequired
		}).isRequired
	}
	constructor(props, context) {
		super(props, context);
		this.state = {
			showEraseConfirm: false,
			preview: null,
			board: {
				items: [],
				trashItems: []
			}
		};
	}
	componentWillMount() {
		// Make this async
		const board = Board.getDetails(this.props.params.id);
		this.setState({
			board
		});
		this.props.setTitle(board.name);
		this.props.setContextMenu({
			icon: 'arrow_back',
			action: () => {
				browserHistory.push('/board');
			}
		});
	}
	componentWillUnmount() {
		this.props.setContextMenu(null);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.dragItemType !== this.props.dragItemType) {
			if (!nextProps.dragItemType) {
				this.setState({
					preview: null
				});
			}
		}
	}
	onPreviewChanged(source, component) {
		this.setState({
			preview: component
		});
	}
	onClickTrash() {
		if (this.state.board.trashItems.length > 0) {
			this.setState({
				showEraseConfirm: true
			});
		}
	}
	onClickDeleteConfirm() {
		this.setState(update(this.state, {
			board: {
				trashItems: { $set: [] }
			},
			showEraseConfirm: { $set: false }
		}));
	}
	onClickDeleteCancel() {
		this.setState({
			showEraseConfirm: false
		});
	}
	onDropTrash(props, monitor) {
		const dropItem = monitor.getItem();
		const { board } = this.state;
		const idx = board.items.findIndex(item => item.id === dropItem.id);
		const data = board.items[idx];
		if (idx >= 0) {
			console.warn('Invalid Item Dropped on Trash, check data value');
			return;
		}
		this.setState(update(this.state, {
			board: {
				items: {
					$splice: [
						[idx, 1]
					]
				},
				trashItems: {
					$push: [data]
				}
			}
		}));
	}
	onDropAdd(props, monitor) {
		console.log('add');
	}
	render() {
		const { board } = this.state;
		const items = board.items.map(item => {
			return <Item type={item.type} data={item} key={item.id}
				notifyPreviewChanged={::this.onPreviewChanged} />;
		});
		return (
			<div className="view board-detail mdl-layout__content">
				<div className="list">
					{items}
					<PreviewItem component={this.state.preview} />
				</div>
				<div className="fab">
					<FABButton onDrop={::this.onDropTrash} onClick={::this.onClickTrash}
						decoration={{colored:!!this.state.board.trashItems.length, ripple:!0}} icon="delete" />
					<FABButton onDrop={::this.onDropAdd}
						decoration={{accent:!0, ripple:!0}} icon="add" />
				</div>
				<Dialog open={this.state.showEraseConfirm}>
					<DialogTitle>Confirm</DialogTitle>
					<DialogContent>
						Do you want to permanently delete all the items in Trash?
					</DialogContent>
					<DialogActions>
						<Button type="button" onClick={::this.onClickDeleteConfirm}>Confirm</Button>
						<Button type="button" onClick={::this.onClickDeleteCancel}>Cancel</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}
