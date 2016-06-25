import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import css from './style.scss';

export default class SortableList extends Component {
	static propTypes = {
		items: PropTypes.arrayOf(PropTypes.object),
		keyName: PropTypes.string.isRequired,
		onDragMove: PropTypes.func,
		onDragOut: PropTypes.func,
		onDragIn: PropTypes.func,
		style: PropTypes.object,
		className: PropTypes.string,
		allowIn: PropTypes.bool,
		allowOut: PropTypes.bool,
	};
	static defaultProps = {
		allowIn: false,
		allowOut: false,
		onDragMove: emptyFunction,
		onDragOut: emptyFunction,
		onDragIn: emptyFunction,
	};
	render() {
		const { items, keyName, className, style } = this.props;
		const renderedItems = items.map((item, i) => {
			return (
				<SortableListItem value={item} index={i} container={this}
					key={'sortable-list-key-' + item[keyName]}
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

@DragSource('SortableListItem',
	{
		beginDrag(props) {
			const { keyName } = props.container.props;
			return {
				// It required to identify dragging state
				key: props.value[keyName],
				container: props.container,
				index: props.index,
			};
		},
	},
	(connect) => ({
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
	})
)
@DropTarget('SortableListItem',
	{
		hover(props, monitor, component) {
			if (component && component.onHover) {
				component.onHover(props, monitor);
			}
		}
	},
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
			container,
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
		if (dragItem && dragItem.key === value[container.props.keyName]) {
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
		const dragSrc = monitor.getItem();
		const srcIdx = dragSrc.index;
		const dstIdx = props.index;
		let moveContainer = false;

		if (props.container !== dragSrc.container) {
			const destAllowIn = props.container.props.allowIn;
			const srcAllowOut = dragSrc.container.props.allowOut;
			moveContainer = destAllowIn && srcAllowOut;
			if (!moveContainer) {
				return;
			}
		} else {
			if (srcIdx === dstIdx) {
				return;
			}
		}
		// Updating property is not responsible of this component.
		// Only notify them to update data
		if (moveContainer) {
			const srcItem = dragSrc.container.props.items[srcIdx];
			dragSrc.container.props.onDragOut(srcIdx, srcItem);

			const dstItem = props.container.props.items[dstIdx];
			props.container.props.onDropIn(dstIdx, dstItem);

			dragSrc.key = srcItem[props.container.props.keyName];
			dragSrc.index = dstIdx;
			dragSrc.container = props.container;
		} else {
			const clientOffset = monitor.getClientOffset();
			const hoverBoundingRect = findDOMNode(props.container)
				.getBoundingClientRect();
			const hoverMiddleY = hoverBoundingRect.height / 2;
			const hoverClientY = clientOffset.y - hoverBoundingRect.top;
			if (srcIdx < dstIdx && hoverClientY < hoverMiddleY) {
				return;
			}
			if (srcIdx > dstIdx && hoverClientY > hoverMiddleY) {
				return;
			}
			dragSrc.container.props.onDragMove(srcIdx, dstIdx);
			dragSrc.index = dstIdx;
		}
	}
}
