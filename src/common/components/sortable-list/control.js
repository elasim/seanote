import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import uuid from 'uuid';
import css from './style.scss';

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
		if (component && component.onHover) {
			component.onHover(props, monitor);
		}
	}
};

export default class SortableList extends Component {
	static propTypes = {
		items: PropTypes.arrayOf(PropTypes.any),
		allowIn: PropTypes.bool,
		allowOut: PropTypes.bool,
		onChange: PropTypes.func,
	};
	static defaultProps = {
		allowIn: false,
		allowOut: false,
		onChange: emptyFunction,
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
		return (
			<div>
				{renderedItems}
			</div>
		);
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
	static propTypes = {
		template: PropTypes.func,
	};
	static defaultProps = {
		template: (props) => (
			<div>{JSON.stringify(props.id)}</div>
		)
	}
	render() {
		const {
			connectDropTarget,
			connectDragSource,
			isDragging,
			dragItem,
			template,
			...restProps
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
					{React.createElement(template, restProps)}
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
				& dragItem.container.props.allowOut;
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

			const srcChanges = {
				items: {
					$splice: [
						[dragIndex, 1]
					]
				}
			};
			const originNewState = update(dragItem.container.state, srcChanges);
			dragItem.container.setState(originNewState);
			dragItem.container.props.onChange(srcChanges);

			const destChanges = {
				items: {
					$splice: [
						[hoverIndex, 0, data]
					]
				}
			};
			const destNewState = update(props.container.state, destChanges);
			props.container.setState(destNewState);
			props.container.props.onChange(destChanges);

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
			const changes = {
				items: {
					$splice: [
						[dragIndex, 1],
						[hoverIndex, 0, item]
					]
				}
			};
			const newState = update(dragItem.container.state, changes);
			dragItem.container.setState(newState);
			dragItem.container.props.onChange(changes);
			dragItem.index = hoverIndex;
		}
	}
}
