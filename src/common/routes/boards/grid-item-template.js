import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

import { Textfield } from 'react-mdl';
import Board from '../../models/board';
import SortableList from '../../components/sortable-list';
import css from './grid-item-template.scss';

/// @TODO Extract as Sortable Decorator
///
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
	'SortableListItem',
], itemTarget, (connect) => ({
	connectDropTarget: connect.dropTarget(),
}))
export default class GridItemTemplate extends Component {
	static propTypes = {
		onSwapIndex: PropTypes.func,
		onDataChanged: PropTypes.func,
	};
	static defaultProps = {
		onSwapIndex: emptyFunction,
		onDataChanged: emptyFunction,
	};
	constructor(props, context) {
		super(props, context);
		this.state = {
			nameEditable: false,
			items: props.items,
			name: props.name,
			newText: '',
		};
	}
	render() {
		const {
			className,
			style,
			connectDropTarget,
			connectDragSource,
			connectDragPreview,
			isDragging,
		} = this.props;
		const { items, name, nameEditable } = this.state;
		const containerStyle = Object.assign({}, style, {
			opacity: isDragging ? 0 : 1
		});
		return connectDropTarget(connectDragPreview(
			<div className={cx(css.item, 'mdl-shadow--2dp', className)}
				style={containerStyle}>
				<div className={css['item-header']}>
					{connectDragSource(
						<div className={css.handle}>
							<i className="material-icons">open_with</i>
						</div>
					)}
					<div className={css.title} ref="name"
						onClick={::this.toggleEditName}
						onBlur={::this.toggleEditName}
						contentEditable={nameEditable}
						dangerouslySetInnerHTML={{__html:name||' '}} />
				</div>
				<SortableList items={items} allowIn allowOut
					onChange={::this.onListChanged} ref="list"/>
				<div>
					<Textfield label="Type to add new text" onKeyUp={::this.addItem}
						value={this.state.newText} onChange={::this.onChangeText}/>
				</div>
			</div>
		));
	}
	onChangeText(e) {
		this.setState({
			newText: e.target.value
		});
	}
	toggleEditName(e) {
		if (!this.state.nameEditable) {
			setTimeout(() => {
				findDOMNode(this.refs.name).focus();
			}, 0);
		} else {
			this.setState({
				nameEditable: !this.state.nameEditable,
				name: e.target.innerHTML,
			});
			this.onNameChanged(e.target.innerHTML);
		}
	}
	addItem(e) {
		if (e.keyCode === 13) {
			const changes = {
				items: {
					$push: [
						{
							id: 'new' + Date.now(),
							type: 'Note',
							detail: {
								text: this.state.newText
							}
						}
					]
				}
			};

			this.refs.list.setState(update(this.refs.list.state, changes));
			this.onListChanged(changes);
			this.setState({
				newText: ''
			});
			e.target.blur();
		}
	}
	onListChanged(changes) {
		this.props.onDataChanged(this.props.id, changes);
	}
	onNameChanged(value) {
		this.props.onDataChanged(this.props.id, {
			name: {
				$set: value
			}
		});
	}
	move(props, monitor) {
		clearTimeout(this._moveTimeout);
		this._moveTimeout = setTimeout(::this.move_, 1000/30, props, monitor);
	}

	move_(props, monitor) {
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
		// @TODO FIX (performance, critical)
		// Issue#2
		// Because of performance issue,
		// I didn't define componentWillReceiveProps method on SortableList
		// also, directly access list state and mutate them
		const data = dragItem.container.state.items[dragIndex];
		dragItem.container.setState(update(dragItem.container.state, {
			items: {
				$splice: [
					[dragIndex, 1]
				]
			}
		}));
		const newIndex = this.refs.list.state.items.length;
		this.refs.list.setState(update(this.refs.list.state, {
			items: {
				$push: [
					data
				]
			}
		}));
		dragItem.index = newIndex;
		dragItem.container = this;
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
			this.props.onSwapIndex(dragIndex, hoverIndex);
			dragItem.index = hoverIndex;
		}, 50);
	}
}
