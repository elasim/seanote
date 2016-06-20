import React, { Component, PropTypes } from 'react';
import NoteItem from './types/note';

import { DragSource } from 'react-dnd';
import {
	Icon
} from 'react-mdl';

const componentMapping = {
	'Note': NoteItem,
};

function getItemInnerComponent(type) {
	if (componentMapping[type]) {
		return componentMapping[type];
	} else {
		console.error('Unknown Component Type');
		return;
	}
}

@DragSource('BoardDetailItem', {
	beginDrag(props) {
		return props.data;
	}
}, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))
export default class CardItem extends Component {
	static propTypes = {
		type: PropTypes.string.isRequired,
		data: PropTypes.object.isRequired,
		notifyPreviewChanged: PropTypes.func.isRequired
	};
	componentWillReceiveProps(nextProps) {
		if (!this.props.isDragging && nextProps.isDragging) {
			const innerComponent = getItemInnerComponent(nextProps.type);
			nextProps.notifyPreviewChanged(this, innerComponent);
			return;
		}
	}
	render() {
		const { connectDragSource, data, type } = this.props;
		const dragHandle = connectDragSource(
			<div className="drag-handle">
				<Icon name="drag_handle" />
			</div>
		);
		const component = React.createElement(
			getItemInnerComponent(type), { data	}
		);
		return (
			<div className="item mdl-shadow--2dp">
				{dragHandle}
				{component}
			</div>
		);
	}
}
