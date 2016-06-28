import cx from 'classnames';
import React, { Component, PropTypes } from 'react';

import { DragSource } from 'react-dnd';
import { Icon } from 'react-mdl';

import { dragType } from './constant';
import CardPreview from './preview';
import css from './style.scss';

const componentMapping = {
	'Note': require('./card-note').default,
};

function getItemInnerComponent(type) {
	if (componentMapping[type]) {
		return componentMapping[type];
	} else {
		console.error('Unknown Component Type');
		return;
	}
}

@DragSource(dragType, {
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
			nextProps.notifyPreviewChanged(CardPreview, innerComponent);
		}
	}
	render() {
		const { connectDragSource, data, type, isDragging } = this.props;
		const dragHandle = connectDragSource(
			<div className={css.handle}>
				<Icon name="drag_handle" />
			</div>
		);
		const component = React.createElement(
			getItemInnerComponent(type), { data }
		);
		const classes = cx(css.card, 'mdl-shadow--2dp', {
			[css.dragging]: isDragging
		});
		return (
			<div className={classes}>
				{dragHandle}
				{component}
			</div>
		);
	}
}
