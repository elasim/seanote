import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import css from './style.scss';

const itemSource = {
	beginDrag(props) {
		const { keyName } = props.source.props;
		return {
			// It required to identify dragging state
			key: props.value[keyName],
			source: props.source,
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
		items: PropTypes.arrayOf(PropTypes.object),
		keyName: PropTypes.string.isRequired,
		onIndexChange: PropTypes.func.isRequired,
		onReassign: PropTypes.func,
		style: PropTypes.object,
		className: PropTypes.string,
		allowIn: PropTypes.bool,
		allowOut: PropTypes.bool,
	};
	static defaultProps = {
		allowIn: false,
		allowOut: false,
	};
	render() {
		const { items, keyName, className, style } = this.props;
		const renderedItems = items.map((item, i) => {
			return (
				<SortableListItem value={item} index={i} source={this}
					key={'sortable-list-key-'+item[keyName]}
				/>
			);
		});
		return (
			<div className={className} style={style}>
				{renderedItems}
			</div>
		);
	}
}

@DragSource(
	'SortableListItem',
	itemSource,
	(connect) => ({
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
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
		value: PropTypes.object.isRequired,
		template: PropTypes.func,
		disableHandle: PropTypes.bool,
		disablePreview: PropTypes.bool,
	};
	static defaultProps = {
		template: (props) => (
			<div>{JSON.stringify(props.value.id)}</div>
		),
		disableHandle: false,
		disablePreview: false,
	}
	render() {
		const {
			connectDropTarget,
			connectDragSource,
			connectDragPreview,
			dragItem,
			source,
			template,
			disableHandle,
			disablePreview,
			value
		} = this.props;
		const style = {
			opacity: 1,
			transition: 'opacity 0.2s linear',
		};
		// Its dragging or draging over container
		if (dragItem && dragItem.key === value[source.props.keyName]) {
			style.opacity = 0;
		}
		let handle;
		let rendered;
		if (!disableHandle) {
			handle = connectDragSource(
				<div className={css.handle}>
					<i className="material-icons">drag_handle</i>
				</div>
			);
			rendered = connectDropTarget(
				<div className={css.item} style={style}>
					{handle}
					<div className={css.body}>
						{React.createElement(template, this.props)}
					</div>
				</div>
			);
		} else {
			rendered = connectDropTarget(
				React.createElement(template, this.props)
			);
		}
		if (!disablePreview) {
			rendered = connectDragPreview(rendered);
		}
		return rendered;
	}
	onHover(props, monitor) {
		const dragItem = monitor.getItem();
		const dragIndex = dragItem.index;
		const hoverIndex = props.index;
		let reassignContainer = false;

		if (props.source !== dragItem.source) {
			const destAllowIn = props.source.props.allowIn;
			const srcAllowOut = dragItem.source.props.allowOut;
			reassignContainer = destAllowIn && srcAllowOut;
			if (!reassignContainer) {
				return;
			}
		} else {
			if (dragIndex === hoverIndex) {
				return;
			}
		}
		// Updating property is not responsible of this component.
		// Only notify them to update data
		if (reassignContainer) {
			dragItem.source.props.onReassign(
				dragIndex,
				props.source,
				hoverIndex);
			dragItem.index = hoverIndex;
			dragItem.source = props.source;
		} else {
			const clientOffset = monitor.getClientOffset();
			const hoverBoundingRect = findDOMNode(props.source)
				.getBoundingClientRect();
			const hoverMiddleY = hoverBoundingRect.height / 2;
			const hoverClientY = clientOffset.y - hoverBoundingRect.top;
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}
			dragItem.source.props.onIndexChange(dragIndex, hoverIndex);
			dragItem.index = hoverIndex;
		}
	}
}
