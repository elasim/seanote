import React, { PropTypes } from 'react';
import { ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import Droppable from '../../../lib/dnd/droppable';
import Draggable from '../../../lib/dnd/draggable';
export default function BoardListItem(props, context) {
	const text = {
		primaryText: props.data.name,
		secondaryText: context.intl.formatRelative(props.data.updatedAt),
	};
	const preview = (
		<ListItem {...text} />
	);
	const handle = (
		<Draggable data={props.data} preview={preview}>
			<FontIcon className="material-icons">&#xE25D;</FontIcon>
		</Draggable>
	);
	return (
		<Droppable onDragOver={props.onDragOver}>
			<ListItem
				{...text}
				leftIcon={handle}
				rightIconButton={props.children}
				onClick={props.onClick} />
		</Droppable>
	);
}

BoardListItem.propTypes = {
	data: PropTypes.object,
	onDragOver: PropTypes.func,
};

BoardListItem.contextTypes = {
	intl: PropTypes.object,
};
