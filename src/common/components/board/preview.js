import cx from 'classnames';
import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';

import { Icon } from 'react-mdl';
import css from './style.scss';

@DragLayer(monitor => {
	return {
		data: monitor.getItem(),
		type: monitor.getItemType(),
		isDragging: monitor.isDragging(),
		sourceClientOffset: monitor.getSourceClientOffset(),
	};
})
export default class CardPreview extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			lastOffset: null
		};
	}
	render() {
		const { component, sourceClientOffset, data, className } = this.props;
		if (!component || !sourceClientOffset) {
			return null;
		}
		const { x, y } = sourceClientOffset;
		const transform = `translate(${x}px, ${y}px)`;
		const style = {
			...this.props.style,
			transform,
			WebkitTransform: transform,
			MozTransform: transform,
			OTransform: transform,
			MSTransform: transform,
		};
		const rendered = React.createElement(component, { data });
		return (
			<div className={cx(css.preview, className)} style={style}>
				<div className={css.handle}>
					<Icon name="drag_handle" />
				</div>
				{rendered}
			</div>
		);
	}
}
