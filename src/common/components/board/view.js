import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

import Card from './card';

import css from './style.scss';

const dragItemType = 'BoardDetailItem';
@DropTarget(dragItemType, {}, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	dropTargetMonitor: monitor,
}))
export default class BoardDetailView extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		notifyPreviewChanged: PropTypes.func.isRequired,
	};
	render() {
		const { data, connectDropTarget } = this.props;
		const cards = data.items.map(item => {
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
export { dragItemType };
