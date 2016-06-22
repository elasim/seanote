import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import uuid from 'uuid';
import css from './style.scss';

@DropTarget('SortableListItem', {}, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	dropTargetMonitor: monitor,
}))
export default class SortableList extends Component {
	static propTypes = {
		items: PropTypes.arrayOf(PropTypes.any),
		allowInsert: PropTypes.bool,
		allowExtract: PropTypes.bool,
		onSort: PropTypes.func,
	};
	static defaultProps = {
		allowInsert: false,
		allowExtract: false,
		onSort: emptyFunction,
	};
	constructor(props, context) {
		super(props, context);
		this.state = {
			items: props.items.map(item => ({
				id: uuid.v4(),
				...item,
			}))
		};
	}
	render() {
		const renderedItems = this.state.items.map((item, i) => {
			return (
				<SortableListItem {...item}
					container={this}
					key={'sortable-list-key-'+item.id}
					index={i}
				/>
			);
		});
		if (renderedItems.length === 0) {
			renderedItems.push(
				<SortableListEmptyItem
					id="empty-item"
					container={this}
					key="sortable-list-empty"
					index={0}
				/>
			);
		}
		return (
			<div className={css.root}>
				{renderedItems}
			</div>
		);
	}
}

const itemSource = {
	beginDrag(props) {
		return {
			container: props.container,
			id: props.id,
			index: props.index,
		};
	}
};

const itemTarget = {
	hover(props, monitor, component) {
		component.onHover(props, monitor);
	}
};

@DropTarget(
	'SortableListItem',
	itemTarget,
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		dropTargetMonitor: monitor,
	})
)
class SortableListEmptyItem extends Component {
	render() {
		const { connectDropTarget } = this.props;
		return connectDropTarget(
			<div className={css.item}>&nbsp;</div>
		);
	}
	onHover(props, monitor) {
		const dragItem = monitor.getItem();
		const dragIndex = dragItem.index;
		const hoverIndex = props.index;
		let containerChanged = false;

		if (props.container !== dragItem.container) {
			containerChanged = true
				& props.container.props.allowIn
				& dragItem.container.props.allowOut
				;
			if (!containerChanged) {
				return;
			}
		} else {
			if (dragIndex === hoverIndex) {
				return;
			}
		}

		if (containerChanged) {
			const data = dragItem.container.state.items[dragIndex];
			dragItem.container.setState(update(dragItem.container.state, {
				items: {
					$splice: [
						[dragIndex, 1]
					]
				}
			}));
			props.container.setState(update(props.container.state, {
				items: {
					$splice: [
						[hoverIndex, 1, data]
					]
				}
			}));
			monitor.getItem().index = hoverIndex;
			monitor.getItem().container = props.container;
		}
	}
}

@DragSource(
	'SortableListItem',
	itemSource,
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	})
)
@DropTarget(
	'SortableListItem',
	itemTarget,
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		dragItem: monitor.getItem(),
	})
)
class SortableListItem extends Component {
	render() {
		const {
			connectDropTarget,
			connectDragSource,
			isDragging,
			dragItem,
		} = this.props;
		const style = {
			opacity: 1,
			transition: 'opacity 0.2s linear',
		};
		if (isDragging || (dragItem && dragItem.id === this.props.id)) {
			style.opacity = 0;
		}
		return connectDropTarget(connectDragSource(
			<div className={css.item} style={style}>
				<div className={css.handle}>
					<i className="material-icons">drag_handle</i>
				</div>
				<div className={css.body}>
					{JSON.stringify(this.props.id)}
				</div>
			</div>
		));
	}
	onHover(props, monitor) {
		const dragItem = monitor.getItem();
		const dragIndex = dragItem.index;
		const hoverIndex = props.index;
		let containerChanged = false;

		if (props.container !== dragItem.container) {
			containerChanged = true
				& props.container.props.allowIn
				& dragItem.container.props.allowOut
				;
			if (!containerChanged) {
				return;
			}
		} else {
			if (dragIndex === hoverIndex) {
				return;
			}
		}

		if (containerChanged) {
			/// @TODO WRONG!!!!!!!!!!!!!!!! REFACTORING THIS
			/// I SHOULD HAVE TO PUT THIS STUB ON CONTAINER
			const data = dragItem.container.state.items[dragIndex];

			const originNewState = update(dragItem.container.state, {
				items: {
					$splice: [
						[dragIndex, 1]
					]
				}
			});
			dragItem.container.setState(originNewState);
			dragItem.container.props.onSort(originNewState.items);
			
			const destNewState = update(props.container.state, {
				items: {
					$splice: [
						[hoverIndex, 0, data]
					]
				}
			});
			props.container.setState(destNewState);
			props.container.props.onSort(destNewState.items);
			dragItem.index = hoverIndex;
			dragItem.container = props.container;
		} else {
			const clientOffset = monitor.getClientOffset();
			const hoverBoundingRect = findDOMNode(props.container)
				.getBoundingClientRect();

			const hoverMiddleY = hoverBoundingRect.height / 2;
			const hoverClientY = clientOffset.y - hoverBoundingRect.top;

			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}
			// because container wasn't changed
			// props.container === dragItem.container
			// so, I'll use dragItem.container to maintain code consistency
			const item = dragItem.container.state.items[dragIndex];
			const newState = update(dragItem.container.state, {
				items: {
					$splice: [
						[dragIndex, 1],
						[hoverIndex, 0, item]
					]
				}
			});
			dragItem.container.setState(newState);
			dragItem.container.props.onSort(newState.items);
			dragItem.index = hoverIndex;
		}
	}
}
