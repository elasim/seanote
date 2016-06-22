import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

import Board from '../../models/board';
import SortableList from '../../components/sortable-list';
import css from './style.scss';

/// @TODO Extract as Sortable Decorator
///
const itemSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		};
	}
};
const itemTarget = {
	hover: (props, monitor, component) => component.onHover(props, monitor),
};

@DragSource('BoardListItem', itemSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	connectDragPreview: connect.dragPreview(),
	isDragging: monitor.isDragging(),
}))
@DropTarget('BoardListItem', itemTarget, (connect) => ({
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
		};
	}
	toggleEditName(e) {
		if (!this.state.nameEditable) {
			this.setState({
				nameEditable: !this.state.nameEditable,
			});
			setTimeout(() => {
				findDOMNode(this.refs.name).focus();
			}, 0);
		} else {
			this.setState({
				nameEditable: !this.state.nameEditable,
				name: e.target.innerHTML,
			});
			this.onNameChanged('name', e.target.innerHTML);
		}
	}
	render() {
		const {
			className,
			style,
			...data,
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
							<i className="material-icons">drag_handle</i>
						</div>
					)}
					<div className={css.title} ref="name"
						onClick={::this.toggleEditName}
						onBlur={::this.toggleEditName}
						contentEditable={nameEditable}
						dangerouslySetInnerHTML={{__html:name||' '}} />
				</div>
				<SortableList items={items} allowIn allowOut
					onSort={::this.onListOrderChanged} />
			</div>
		));
	}
	onListOrderChanged(orderedItems) {
		this.props.onDataChanged(this.props.id, 'items', orderedItems);
	}
	onNameChanged(name, value) {
		this.props.onDataChanged(this.props.id, name, value);
	}
	onHover(props, monitor) {
		const dragItem = monitor.getItem();
		const dragIndex = dragItem.index;
		const hoverIndex = props.index;

		if (dragIndex === hoverIndex) {
			return;
		}

		this.props.onSwapIndex(dragIndex, hoverIndex);
		monitor.getItem().index = hoverIndex;
	}
}
