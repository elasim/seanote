import React, { Component, PropTypes } from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import pure from 'recompose/pure';
import ListItem from './list-item';
import Symbol from '../../../../lib/symbol-debug';
import css from './list.scss';

const iconButtonElement = (
	<IconButton>
		<FontIcon className="material-icons">&#xE5D4;</FontIcon>
	</IconButton>
);

// DEBUG
const EventTypes = {
	DragOver: Symbol('BoardList.DragOver'),
	Drop: Symbol('BoardList.Drop'),
};

@pure
class BoardList extends Component {
	static propTypes = {
		items: PropTypes.array.isRequired,
		activeItem: PropTypes.string,
		onMessage: PropTypes.func,
	};
	componentWillMount() {
		this.dispatchMessage = ::this.dispatchMessage;
	}
	render() {
		const { items, activeItem } = this.props;
		const listItems = items.filter(item => !item.hide).map(item => (
			<ListItem data={item} key={item.id}
				active={activeItem === item.id}
				onMessage={this.dispatchMessage}>
				<IconMenu iconButtonElement={iconButtonElement}
					useLayerForClickAway={true}>
					<MenuItem style={{ WebkitAppearance: 'none' }}>Setting</MenuItem>
					<MenuItem style={{ WebkitAppearance: 'none' }}>Share</MenuItem>
					<MenuItem style={{ WebkitAppearance: 'none' }}>Delete</MenuItem>
				</IconMenu>
			</ListItem>
		));
		return <div className={css.root}>
			{listItems}
		</div>;
	}
	sendMessage(msg, args) {
		const { onMessage } = this.props;
		if (onMessage) {
			onMessage(msg, args);
		}
	}
	dispatchMessage(msg, args) {
		const translated = this.translateMessage(msg);
		if (translated) {
			this.sendMessage(this.translateMessage(msg), args);
		}
	}
	translateMessage(msg) {
		switch (msg) {
			case ListItem.EventTypes.DragOver: {
				return EventTypes.DragOver;
			}
		}
	}
}

BoardList.EventTypes = EventTypes;

export default BoardList;
