import React, { Component, PropTypes } from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import pure from 'recompose/pure';
import ListItem from './list-item';
import css from '../styles/list.scss';

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

@pure
class BoardList extends Component {
	static propTypes = {
		list: PropTypes.array.isRequired,
		activeItem: PropTypes.string,
		onMessage: PropTypes.func,
	};
	componentWillMount() {
		this.onDragOver = ::this.onDragOver;
	}
	render() {
		const { list, activeItem } = this.props;
		const items = list.filter(item => !item.hide).map(item => (
			<ListItem data={item} key={item.id}
				active={activeItem === item.id}
				onDragOver={this.onDragOver}>
				<IconMenu iconButtonElement={iconButtonElement}
					useLayerForClickAway={true}>
					<MenuItem style={{ WebkitAppearance: 'none' }}>Setting</MenuItem>
					<MenuItem style={{ WebkitAppearance: 'none' }}>Share</MenuItem>
					<MenuItem style={{ WebkitAppearance: 'none' }}>Delete</MenuItem>
				</IconMenu>
			</ListItem>
		));
		return <div className={css.root}>
			{items}
		</div>;
	}
	onDragOver(event, ...args) {
		const { onMessage } = this.props;
		if (onMessage) {
			onMessage(EventTypes.DragOver, args);
		}
	}
}
// function open(val) {
// 	browserHistory.push(`/boards/${val}`);
// 	this.
// }

BoardList.EventTypes = EventTypes;

export default BoardList;
