import Rx from 'rx';
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import update from 'react/lib/update';
import BoardAction from '../../actions/board';

import CascadeGrid from '../../components/cascade-grid';
import AddButton from './buttons/add';
import TrashButton from './buttons/trash';
import GridItemTemplate from './grid-item-template';
import css from './style.scss';

export default class BoardDetail extends Component {
	static defaultProps = {
		connectDropTarget: (x)=>x
	};
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
		setContextMenu: PropTypes.func.isRequired,
		router: PropTypes.object,
	};
	static preDispatch(dispatch) {
		return new Promise((resolve, reject) => {
			dispatch(BoardAction.fetchData(e => {
				!e ? resolve() : reject(e);
			}));
		});
	}
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
		this.props.router.push('/signin');
	}
	componentDidMount() {
		const element = findDOMNode(this);
		this.resize$ = Rx.Observable.timer(0, 500)
			.map(() => element.clientWidth)
			.distinctUntilChanged()
			.subscribe(() => this.adjustLayout());
		this.context.setContextMenu({
			icon: 'arrow_back',
			action: () => this.props.router.push('/board'),
		});
//		this.props.action.fetchData();
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
					itemTemplate={this._gridItemTemplate}
					className={css.padding} />
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
		this.props.action.moveBoard(a, b);
	}
	moveBoardToTrash(idx) {
		this.props.action.moveBoardToTrash(idx);
	}
	moveCard(src, srcIdx, dst, dstIdx) {
		this.props.action.moveCard(src, srcIdx, dst, dstIdx);
	}
	moveCardToTrash(id, idx) {
		this.props.action.moveCardToTrash(id, idx);
	}
	createText(id, text) {
		this.props.action.createCard(id, 'Note', { text });
	}
	updateBoardName(id, name) {
		this.props.action.setName(id, name);
	}
	updateCard(id, cardId, detail) {
		this.props.action.updateCard(id, cardId, detail);
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
