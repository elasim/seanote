import React, { PropTypes } from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import pure from 'recompose/pure';
import BoardListItem from './board-list-item';

const iconButtonElement = (
	<IconButton>
		<FontIcon className="material-icons">&#xE5D4;</FontIcon>
	</IconButton>
);

// DEBUG
const Symbol = a => a;
const EventTypes = {
	DragOver: Symbol('BoardList.DragOver'),
	Drop: Symbol('BoardList.Drop'),
};

function BoardList(props) {
	const { list } = props;
	const items = list.map(item => (
		<BoardListItem data={item} key={item.id}
			onClick={() => open(item.id)}
			onDragOver={(...args) => props::onDragOver(...args, item)}>
			<IconMenu iconButtonElement={iconButtonElement}
				useLayerForClickAway={true}>
				<MenuItem style={{ WebkitAppearance: 'none' }}>Setting</MenuItem>
				<MenuItem style={{ WebkitAppearance: 'none' }}>Share</MenuItem>
				<MenuItem style={{ WebkitAppearance: 'none' }}>Delete</MenuItem>
			</IconMenu>
		</BoardListItem>
	));
	return <div>{items}</div>;
}
BoardList.propTypes = {
	list: PropTypes.array.isRequired,
	onMessage: PropTypes.func,
};
function onDragOver(event, ...args) {
	const { onMessage } = this;
	if (onMessage) {
		onMessage(EventTypes.DragOver, args);
	}
}
function open(val) {
	browserHistory.push(`/boards/${val}`);
}

const Component = pure(BoardList);

Component.EventTypes = EventTypes;

export default Component;
