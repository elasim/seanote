import _ from 'lodash';
import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

import { Textfield } from 'react-mdl';
import SortableList from '../../components/sortable-list';
import EditableDiv from './editable-div';
import NoteCard from './card/note';

import css from './grid-item-template.scss';

const BOARD_SWAP_DELAY = 50;

@DragSource('BoardListItem', {
	beginDrag(props) {
		return {
			id: props.value.id,
			index: props.index,
		};
	}
}, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	connectDragPreview: connect.dragPreview(),
	isDragging: monitor.isDragging(),
}))
@DropTarget([
	'BoardListItem',
	'SortableListItem',
], {
	hover: (props, monitor, component) => {
		switch (monitor.getItemType()) {
			case 'BoardListItem':
				component.onBoardHover(props, monitor);
				break;
			case 'SortableListItem':
				component.onCardHover(props, monitor);
				return;
		}
	}
}, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	dragItem: monitor.getItem(),
	dragItemType: monitor.getItemType(),
}))
export default class GridItemTemplate extends Component {
	static propTypes = {
		onBoardMove: PropTypes.func.isRequired,
		onCardMove: PropTypes.func.isRequired,
		onCardDragOut: PropTypes.func.isRequired,
		onCardDropIn: PropTypes.func.isRequired,
		onNameChange: PropTypes.func.isRequired,
		onTextCreate: PropTypes.func.isRequired,
		onCardChange: PropTypes.func.isRequired,
	};
	constructor(props, context) {
		super(props, context);
		this.state = {
			newText: '',
		};
		this.onListMove = ::this.onListMove;
		this.onListOut = ::this.onListOut;
		this.onListIn = ::this.onListIn;
		this.onTextfieldKeyDown = ::this.onTextfieldKeyDown;
		this.onTextfieldChange = ::this.onTextfieldChange;
		this.onNameChange = ::this.onNameChange;
		this.onCardChange = ::this.onCardChange;
		this._cardItemTemplate = (props) => {
			return <NoteCard value={props.value} onCardChange={this.onCardChange} />;
		};
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.value.items.length !== this.props.value.items.length) {
			this.state.newText = '';
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (!_.isEqual(this.state, nextState))
			return true;
		if (!_.isEqual(this.props, nextProps))
			return true;

		return !this.props.compare(nextProps.value, this.props.value);
	}
	render() {
		const {
			value: { id, name, style, className, items },
			connectDropTarget,
			connectDragSource,
			connectDragPreview,
			dragItem,
			dragItemType,
			isDragging,
		} = this.props;
		let outerStyle = {};
		if (dragItemType === 'BoardListItem') {
			if (isDragging || dragItem.id === id) {
				outerStyle.opacity = 0;
				outerStyle.transition = 'opacity 0.2s linear';
			}
		}
		return connectDragPreview(connectDropTarget(
			<div className={cx(css.item, 'mdl-shadow--2dp', className)}
				style={{...style, ...outerStyle}}>
				<div className={css['item-header']}>
					{connectDragSource(
						<div className={css.handle}>
							<i className="material-icons">open_with</i>
						</div>
					)}
					<EditableDiv defaultValue={name} className={css.name}
						onChange={this.onNameChange}
						placeholder="Untitled" />
				</div>
				{/* parent prop isn't belong to list, it's served to move container */}
				<SortableList items={items} ref="list" keyName="id"
					parent={id} template={this._cardItemTemplate}
					onDragMove={this.onListMove}
					onDragOut={this.onListOut}
					onDropIn={this.onListIn}
					allowIn allowOut />
				<div>
					<Textfield value={this.state.newText}
						onKeyDown={this.onTextfieldKeyDown}
						onChange={this.onTextfieldChange}
						label="Type to add new text" />
				</div>
			</div>
		));
	}
	onNameChange(name) {
		this.props.onNameChange(this.props.value.id, name);
	}
	onCardChange(cardId, detail) {
		this.props.onCardChange(this.props.value.id, cardId, detail);
	}
	onTextfieldChange(e) {
		this.setState({
			newText: e.target.value
		});
	}
	onTextfieldKeyDown(e) {
		const { value: { id }, onTextCreate } = this.props;
		if (e.keyCode === 13) {
			e.preventDefault();
			e.stopPropagation();
			e.target.blur();
			this.props.onTextCreate(this.props.value.id, e.target.value);
		}
	}
	onListMove(srcIdx, dstIdx) {
		const { id } = this.props.value;
		this.props.onCardMove(id, srcIdx, id, dstIdx);
	}
	onListOut(idx) {
		this.props.onCardDragOut(this.props.value.id, idx);
	}
	onListIn(idx) {
		this.props.onCardDropIn(this.props.value.id, idx);
	}
	onCardHover(props, monitor) {
		if (!monitor.isOver({ shallow: true })) {
			return;
		}
		const srcInfo = monitor.getItem();
		if (!srcInfo) {
			return;
		}
		const srcIndex = srcInfo.index;
		if (this.refs.list === srcInfo.container) {
			return;
		}
		// dragItem container direct list, not this grid-item
		clearTimeout(this._swapDelay);
		this._swapDelay = setTimeout(() => {
			const src = srcInfo.container.props.parent;
			const dstIdx = this.props.value.items.length;
			this.props.onCardMove(src, srcIndex, this.props.value.id, dstIdx);
			srcInfo.index = dstIdx;
			srcInfo.container = this.refs.list;
		}, BOARD_SWAP_DELAY);
		return;
	}
	onBoardHover(props, monitor) {
		const srcItem = monitor.getItem();
		const srcIdx = srcItem.index;
		const dstIdx = props.index;

		if (srcIdx === dstIdx) {
			return;
		}
		const clientOffset = monitor.getClientOffset();
		const srcBoundingRect = findDOMNode(srcItem.container).getBoundingClientRect();
		const dstBoundingRect = findDOMNode(this).getBoundingClientRect();
		const dstMiddleX = dstBoundingRect.width / 2;
		const dstMiddleY = dstBoundingRect.height / 2;
		const dstClientX = clientOffset.x - dstBoundingRect.left;
		const dstClientY = clientOffset.y - dstBoundingRect.top;

		if (srcBoundingRect.left < dstBoundingRect.left) {
			if (dstClientX > dstMiddleX) {
				return;
			}
		}
		if (srcBoundingRect.left > dstBoundingRect.left) {
			if (dstClientX < dstMiddleX) {
				return;
			}
		}
		if (srcBoundingRect.top < dstBoundingRect.top) {
			if (dstClientY > dstMiddleY) {
				return;
			}
		}
		if (srcBoundingRect.top > dstBoundingRect.top) {
			if (dstClientY < dstMiddleY) {
				return;
			}
		}
		clearTimeout(this._swapDelay);
		this._swapDelay = setTimeout(() => {
			this.props.onBoardMove(srcIdx, dstIdx);
			srcItem.index = dstIdx;
		}, BOARD_SWAP_DELAY);
	}
}
