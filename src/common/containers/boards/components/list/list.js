import React, { PropTypes } from 'react';
import pure from 'recompose/pure';
import ListItem from './list-item';
import ComponentEx from '../../../../components/component';
import Symbol from '../../../../lib/symbol-debug';
import css from './list.scss';

// DEBUG
const EventTypes = {
	DragOver: Symbol('BoardList.DragOver'),
	Drop: Symbol('BoardList.Drop'),
	TextChange: Symbol('BoardList.TextChange'),
	Delete: Symbol('BoardList.Delete'),
	Share: Symbol('BoardList.Share'),
	Setting: Symbol('BoardList.Setting'),
};

@pure
class BoardList extends ComponentEx {
	static propTypes = {
		items: PropTypes.array.isRequired,
		activeItem: PropTypes.string,
	};
	componentWillMount() {
		this.dispatchMessage = ::this.dispatchMessage;
	}
	render() {
		const { items, activeItem } = this.props;
		const listItems = items.map(item => (
			<ListItem data={item} key={item.id}
				active={activeItem === item.id}
				onMessage={this.dispatchMessage} />
		));
		return (
			<div className={css.root}>
				{listItems}
			</div>
		);
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
			case ListItem.EventTypes.TextChange: {
				return EventTypes.TextChange;
			}
			case ListItem.EventTypes.DeleteMenuClick: {
				return EventTypes.Delete;
			}
			case ListItem.EventTypes.ShareMenuClick: {
				return EventTypes.Share;
			}
			case ListItem.EventTypes.SettingsMenuClick: {
				return EventTypes.Setting;
			}
		}
	}
}

BoardList.EventTypes = EventTypes;

export default BoardList;
