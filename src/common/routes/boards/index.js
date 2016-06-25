import Rx from 'rx';
import cx from 'classnames';
import uuid from 'uuid';
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { findDOMNode } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import * as Board from '../../actions/board';

import CascadeGrid from '../../components/cascade-grid';
import AddButton from './buttons/add';
import TrashButton from './buttons/trash';
import GridItemTemplate from './grid-item-template';
import css from './style.scss';

@DragDropContext(HTML5Backend)
@DropTarget(
	[
		'BoardListItem',
		'SortableListItem',
		'Command',
	],
	createDropEventHandler(),
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		dragItemType: monitor.getItemType(),
		dragItem: monitor.getItem(),
		sourceClientOffset: monitor.getClientOffset(),
	})
)
@connect(
	state => ({
		items: state.board.items,
		trashItems: state.board.trashItems,
	}),
	dispatch => ({
		boardAction: bindActionCreators({
			getData: Board.getData,
			createCard: Board.createCard,
			moveCard: Board.moveCard,
			moveCardToTrash: Board.moveCardToTrash,
			moveBoard: Board.moveBoard,
			moveBoardToTrash: Board.moveBoardToTrash,
			setName: Board.setName,
		}, dispatch)
	})
)
export default class Boards extends Component {
	static defaultProps = {
		connectDropTarget: (x)=>x
	};
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	};
	constructor(props, context) {
		super(props, context);
		this.state = {
			showAddMenu: false,
		};
		const moveBoard = ::this.moveBoard;
		const moveCard = ::this.moveCard;
		const createText = ::this.createText;
		const updateName = ::this.updateBoardName;
		this.cardOut$ = new Rx.Subject();
		this.cardIn$ = new Rx.Subject();
		this.cardMoving$ = Rx.Observable.zip(
			this.cardOut$,
			this.cardIn$,
			(cardOut, cardIn) => ({ ...cardOut, ...cardIn }))
			.subscribe(val => {
				this.moveCard(val.src, val.srcIdx, val.dst, val.dstIdx);
			});
		const connectCardDst = (dst, dstIdx) => {
			this.cardIn$.onNext({ dst, dstIdx });
		};
		const connectCardSrc = (src, srcIdx) => {
			this.cardOut$.onNext({ src, srcIdx });
		};
		this._gridItemTemplate = (props) => {
			return (
				<GridItemTemplate value={props.value}
					index={props.index}
					container={this}
					onBoardMove={moveBoard}
					onCardMove={moveCard}
					onCardDragOut={connectCardSrc}
					onCardDropIn={connectCardDst}
					onNameChange={updateName}
					onTextCreate={createText}
				/>
			);
		};
	}
	componentWillMount() {
		this.context.setTitle('Board');
		this.props.boardAction.getData();
	}
	componentWillUnmount() {
		this.cardOut$.dispose();
		this.cardIn$.dispose();
		this.cardMoving$.dispose();
	}
	render() {
		const { connectDropTarget } = this.props;
		return connectDropTarget(
			<div className={cx('mdl-layout__content', css.root)}>
				<CascadeGrid columnWidth={220}
					items={this.props.items} keyName="id"
					itemTemplate={this._gridItemTemplate} />
				<div className={css.fabs}>
					<AddButton className={css.topmost}
						onDropCard={::this.duplicateCard}
						onDropBoard={::this.duplicateBoard} />
					<TrashButton className={css.topmost}
						getTrashCounts={::this.getTrashCounts}
						onDropCard={::this.moveCardToTrash}
						onDropBoard={::this.moveBoardToTrash} />
				</div>
			</div>
		);
	}
	moveBoard(a, b) {
		this.props.boardAction.moveBoard(a, b);
	}
	moveBoardToTrash(idx) {
		this.props.boardAction.moveBoardToTrash(idx);
	}
	moveCard(src, srcIdx, dst, dstIdx) {
		this.props.boardAction.moveCard(src, srcIdx, dst, dstIdx);
	}
	moveCardToTrash(id, idx) {
		this.props.boardAction.moveCardToTrash(id, idx);
	}
	createText(id, text) {
		this.props.boardAction.createCard(id, 'Note', { text });
	}
	updateBoardName(id, name) {
		this.props.boardAction.setName(id, name);
	}
	duplicateCard(idx) {

	}
	duplicateBoard(idx) {

	}
	getTrashCounts() {
		const count = this.props.items.reduce((acc, item) => {
			return Number(acc) + item.trashItems.length;
		}, 0);
		return count;
	}
	createBoard() {
		// fix this later using ORM
		this.setState(update(this.state, {
			items: {
				$push: [{
					id: 'Board-' + Date.now(),
					name: 'Untitled',
					text: '',
					items: [],
					trashItems: [],
					createdAt: new Date(),
				}]
			},
			showAddMenu: {
				$set: false
			}
		}));
	}
}

function isEqualDeep(a, b) {
	const keyA = Object.keys(a);
	const keyB = Object.keys(b);
	if (!_.isEqual(keyA, keyB)) {
		return false;
	}
	for (let key of keyA) {
		if (a[key] instanceof Object && !isEqualDeep(a[key], b[key])) {
			return false;
		}
	}
	return true;
}

function createDropEventHandler() {
	return {};
	// {
	// 	hover(props, monitor, component) {
	// 		if (!monitor.isOver({ shallow: false })) {
	// 			return;
	// 		}
	// 		// Scroll on edge
	// 		const dom = findDOMNode(component);
	// 		const bound = dom.getBoundingClientRect();
	// 		const cursor = monitor.getSourceClientOffset();
	// 		const edgeHeight = Math.floor(bound.height * 0.1);
	// 		const top = bound.top + edgeHeight;
	// 		const bottom = bound.height - edgeHeight;
	// 		clearInterval(component._hoverScroll);
	// 		if (cursor.y <= top) {
	// 			component._hoverScroll = setInterval(() => {
	// 				dom.scrollTop += cursor.y - top;
	// 			});
	// 			return;
	// 		}
	// 		if (cursor.y >= bottom) {
	// 			component._hoverScroll = setInterval(() => {
	// 				dom.scrollTop += cursor.y - bottom;
	// 			}, 30);
	// 			return;
	// 		}
	// 	},
	// 	drop(drop, monitor, component) {
	// 		clearInterval(component._hoverScroll);
	// 		return;
	// 	},
	// };
}
