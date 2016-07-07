import React, { Component, PropTypes } from 'react';
import { DragLayer } from 'react-dnd';

@DragLayer(monitor => {
	const item = monitor.getItem();
	return {
		item,
		type: monitor.getItemType(),
		isDragging: monitor.isDragging(),
		currentOffset: monitor.getSourceClientOffset(),
	};
})
export default class PreviewItem extends Component {
	static propTypes = {
		value: PropTypes.object.isRequired,
	};
	render () {
		if (!this.props.currentOffset) {
			return null;
		}
		const { x, y } = this.props.currentOffset;
		const style = {
			position: 'fixed',
			left: 0, top: 0,
			transform: `translate(${x}px, ${y}px)`
		};
		return (
			<div style={style}>
				JSON.stringify(this.props.item)
			</div>
		);
	}
}
