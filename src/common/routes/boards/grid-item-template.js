import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

import { Textfield } from 'react-mdl';
import SortableList from '../../components/sortable-list';
import EditableDiv from './editable-div';
import css from './grid-item-template.scss';

const itemSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
			container: props.container,
		};
	}
};
const itemTarget = {
	hover: (props, monitor, component) => {
		switch (monitor.getItemType()) {
			case 'BoardListItem':
				component.onHover(props, monitor);
				break;
			case 'SortableListItem':
				component.move(props, monitor);
				return;
		}
	}
};

@DragSource('BoardListItem', itemSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	connectDragPreview: connect.dragPreview(),
	isDragging: monitor.isDragging(),
}))
@DropTarget([
	'BoardListItem',
//	'SortableListItem',
], itemTarget, (connect) => ({
	connectDropTarget: connect.dropTarget(),
}))
export default class GridItemTemplate extends Component {
	static propTypes = {
		onIndexChange: PropTypes.func.isRequired,
		onReassign: PropTypes.func.isRequired,
		onNameChange: PropTypes.func.isRequired,
		onNewText: PropTypes.func.isRequired,
	};
	constructor(props, context) {
		super(props, context);
		this.state = {
			newText: '',
		};
		this.updateHandlers(props);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.value.id !== this.props.value.id) {
			this.updateHandlers(nextProps);
		}
		this.state.newText = '';
		console.log('C Receive Prop');
	}
	shouldComponentUpdate(nextProps, nextState) {
		console.log('C Should UPdate?');
		return true;
	}
	render() {
		const {
			value,
			connectDropTarget,
			connectDragSource,
			connectDragPreview,
		} = this.props;
		const {
			name,
			style,
			className,
		} = value;
		const { newText } = this.state;
		return connectDropTarget(connectDragPreview(
			<div className={cx(css.item, 'mdl-shadow--2dp', className)}
				style={style}>
				<div className={css['item-header']}>
					{connectDragSource(
						<div className={css.handle}>
							<i className="material-icons">open_with</i>
						</div>
					)}
					<EditableDiv defaultValue={name} className={css.name}
						onChange={this._notifyNameChange}
						placeholder="Untitled" />
				</div>
				<SortableList items={value.items} ref="list" allowIn allowOut
					keyName="id"
					onIndexChange={this._notifyIndexChange}
					onReassign={this._notifyReassign} />
				<div>
					<Textfield value={newText}
						onKeyDown={::this.onTextfieldKeyDown}
						onChange={::this.onTextfieldChange}
						label="Type to add new text" />
				</div>
			</div>
		));
	}
	updateHandlers(props) {
		const { id } = props.value;
		this._notifyIndexChange = (a, b) => {
			props.onIndexChange(id, a, b);
		};
		this._notifyReassign = (myIdx, dest, destIdx) => {
			props.onReassign(id, myIdx, dest, destIdx);
		};
		this._notifyNameChange = (name) => {
			props.onNameChange(id, name);
		};
		this._notifyNewText = (text) => {
			props.onNewText(id, text);
		};
	}
	notifyDataChanged(changes) {
		this.props.onDataChanged(this.props.id, changes);
	}
	onTextfieldChange(e) {
		this.setState({
			newText: e.target.value
		});
	}
	onTextfieldKeyDown(e) {
		if (e.keyCode === 13) {
			e.preventDefault();
			e.stopPropagation();
			e.target.blur();
			this._notifyNewText(e.target.value);
		}
	}
	move(props, monitor) {
		if (!monitor.isOver({ shallow: true })) {
			return;
		}
		const dragItem = monitor.getItem();
		if (!dragItem) {
			return;
		}
		const dragIndex = dragItem.index;
		if (this.refs.list === dragItem.container) {
			return;
		}
		if (!this.refs.list.props.allowIn || !dragItem.container.props.allowOut) {
			return;
		}
		const data = dragItem.container.state.items[dragIndex];
		const srcChanges = {
			items: {
				$splice: [
					[dragIndex, 1]
				]
			}
		};
		// #2
		dragItem.container.props.onChange(srcChanges);
		const newIndex = this.refs.list.state.items.length;
		const destChanges = {
			items: {
				$push: [
					data
				]
			}
		};
		// #2
		this.refs.list.setState(update(this.refs.list.state, destChanges));
		this.notifyDataChanged(destChanges);

		dragItem.index = newIndex;
		dragItem.container = this.refs.list;
		return;
	}
	onHover(props, monitor) {
		const dragItem = monitor.getItem();
		const dragIndex = dragItem.index;
		const hoverIndex = props.index;

		if (dragIndex === hoverIndex) {
			return;
		}
		const clientOffset = monitor.getClientOffset();
		const clientBoundingRect = findDOMNode(dragItem.container).getBoundingClientRect();
		const hoverBoundingRect = findDOMNode(this).getBoundingClientRect();
		const hoverMiddleX = hoverBoundingRect.width / 2;
		const hoverMiddleY = hoverBoundingRect.height / 2;
		const hoverClientX = clientOffset.x - hoverBoundingRect.left;
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		if (clientBoundingRect.left < hoverBoundingRect.left) {
			if (hoverClientX > hoverMiddleX) {
				return;
			}
		}
		if (clientBoundingRect.left > hoverBoundingRect.left) {
			if (hoverClientX < hoverMiddleX) {
				return;
			}
		}
		if (clientBoundingRect.top < hoverBoundingRect.top) {
			if (hoverClientY > hoverMiddleY) {
				return;
			}
		}
		if (clientBoundingRect.top > hoverBoundingRect.top) {
			if (hoverClientY < hoverMiddleY) {
				return;
			}
		}
		clearTimeout(this._swapDelay);
		this._swapDelay = setTimeout(() => {
			this.props.onIndexChangeIndex(dragIndex, hoverIndex);
			dragItem.index = hoverIndex;
		}, 50);
	}
}
