import React, { Component, PropTypes } from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import { injectIntl } from 'react-intl';

import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import DragHandleIcon from 'material-ui/svg-icons/editor/drag-handle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Droppable from '../../../lib/dnd/droppable';
import Draggable from '../../../lib/dnd/draggable';

import pure from 'recompose/pure';

const iconButtonElement = (
	<IconButton>
		<MoreVertIcon />
	</IconButton>
);
const iconMenu = (
	<IconMenu iconButtonElement={iconButtonElement}
		useLayerForClickAway={true}>
		<MenuItem style={{ WebkitAppearance: 'none' }}>Setting</MenuItem>
		<MenuItem style={{ WebkitAppearance: 'none' }}>Share</MenuItem>
		<MenuItem style={{ WebkitAppearance: 'none' }}>Delete</MenuItem>
	</IconMenu>
);
const dragHandle = (
	<DragHandleIcon />
);

const EventTypes = {
	DragOver: Symbol('BoardList.DragOver'),
	Drop: Symbol('BoardList.Drop'),
};

@pure
@injectIntl
class BoardList extends Component {
	static propTypes = {
		list: PropTypes.array.isRequired,
		onMessage: PropTypes.func,
	};
	render() {
		const { list, intl } = this.props;
		const items = list
			.map((item, i) => {
				const commonProps = {
					primaryText: item.name,
					secondaryText: intl.formatRelative(item.updatedAt),
				};
				const preview = (
					<ListItem {...commonProps} leftIcon={dragHandle} />
				);
				const draggableHandle = (
					<Draggable data={item} preview={preview}>
						{dragHandle}
					</Draggable>
				);
				const props = {
					...commonProps,
					leftIcon: draggableHandle,
					rightIconButton: iconMenu,
					onClick() {
						this::open(item.id);
					},
				};
				const dragEvents = {
					onDragOver: (e, desc) => this.onDragOver(e, desc, item),
				};
				return (
					<Droppable key={i} {...dragEvents}>
						<div>
							<ListItem {...props} />
							<Divider />
						</div>
					</Droppable>
				);
			});
		return <div>{items}</div>;
	}
	onDragOver(event, ...args) {
		const { onMessage } = this.props;
		if (onMessage) {
			onMessage(EventTypes.DragOver, args);
		}
	}
}

function open(val) {
	browserHistory.push(`/boards/${val}`);
}

BoardList.EventTypes = EventTypes;

export default BoardList;