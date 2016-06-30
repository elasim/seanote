import Rx from 'rx';
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { findDOMNode } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { DropTarget } from 'react-dnd';
import * as BoardAction from '../../actions/board';

import CascadeGrid from '../../components/cascade-grid';
import AddButton from './buttons/add';
import TrashButton from './buttons/trash';
import GridItemTemplate from './grid-item-template';
import css from './style.scss';

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
			getData: BoardAction.getData,
			createCard: BoardAction.createCard,
			moveCard: BoardAction.moveCard,
			moveCardToTrash: BoardAction.moveCardToTrash,
			moveBoard: BoardAction.moveBoard,
			moveBoardToTrash: BoardAction.moveBoardToTrash,
			setName: BoardAction.setName,
			updateCard: BoardAction.updateCard,
		}, dispatch)
	})
)

@withRouter
export default class BoardDetail extends Component {
	static defaultProps = {
		connectDropTarget: (x)=>x
	};
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
		setContextMenu: PropTypes.func.isRequired,
		router: PropTypes.object,
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
		const updateCard = ::this.updateCard;
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
					compare={isEqualDeep}
					index={props.index}
					container={this}
					onBoardMove={moveBoard}
					onCardMove={moveCard}
					onCardDragOut={connectCardSrc}
					onCardDropIn={connectCardDst}
					onCardChange={updateCard}
					onNameChange={updateName}
					onTextCreate={createText}
				/>
			);
		};
	}
	componentWillMount() {
		this.context.setTitle('Board');
		this.context.setContextMenu({
			icon: 'arrow_back',
			action: () => this.props.router.goBack(),
		});
		this.props.boardAction.getData();
	}
	componentDidMount() {
		const element = findDOMNode(this);
		this.resize$ = Rx.Observable.timer(0, 500)
			.map(() => element.clientWidth)
			.distinctUntilChanged()
			.subscribe(() => this.adjustLayout());
	}
	componentWillUnmount() {
		this.resize$.dispose();
		this.context.setContextMenu(null);
		this.cardOut$.dispose();
		this.cardIn$.dispose();
		this.cardMoving$.dispose();
	}
	render() {
		const { connectDropTarget } = this.props;
		return connectDropTarget(
			<div className={css.root}>
				<CascadeGrid columnWidth={220}
					items={this.props.items} keyName="id"
					ref="grid"
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
	adjustLayout() {
		this.refs.grid.adjustLayout();
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
	updateCard(id, cardId, detail) {
		this.props.boardAction.updateCard(id, cardId, detail);
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
	if (!_.isEqual(a, b)) return false;
	if (a.items.length !== b.items.length) return false;
	for (let i = 0; i < a.items.length; ++i) {
		if (!_.isEqual(a.items[i], b.items[i])) return false;
		if (!_.isEqual(a.items[i].detail, b.items[i].detail)) return false;
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
