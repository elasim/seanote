import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';

import { Icon } from 'react-mdl';

@DragLayer(monitor => {
	return {
		data: monitor.getItem(),
		type: monitor.getItemType(),
		sourceClientOffset: monitor.getSourceClientOffset(),
	};
})
export default class ItemPreview extends Component {
	render() {
		const { component, sourceClientOffset, data } = this.props;
		if (!component || !sourceClientOffset) {
			return null;
		}
		const { x, y } = sourceClientOffset;
		const transform = `translate(${x}px, ${y}px)`;
		const style = {
			transform,
			WebkitTransform: transform,
			MozTransform: transform,
			OTransform: transform,
			MSTransform: transform,
		};
		const rendered = React.createElement(component, { data });
		return (
			<div className="item preview" style={style}>
				<div className="drag-handle">
					<Icon name="drag_handle" />
				</div>
				{rendered}
			</div>
		);
	}
}
