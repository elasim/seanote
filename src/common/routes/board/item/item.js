import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

import { dragType } from './constant';
import Card from './card';

import css from './style.scss';

@DropTarget(dragType, {}, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	dropTargetMonitor: monitor,
}))
export default class Board extends Component {
	static propTypes = {
		items: PropTypes.arrayOf(PropTypes.object).isRequired,
		notifyPreviewChanged: PropTypes.func.isRequired,
	};
	render() {
		const { items, connectDropTarget } = this.props;
		const cards = items.map(item => {
			return <Card type={item.type} data={item} key={item.id}
				notifyPreviewChanged={this.props.notifyPreviewChanged} />;
		});
		return connectDropTarget(
			<div className={css.root}>
				<div className={css.list}>
					{cards}
				</div>
			</div>
		);
	}
}
