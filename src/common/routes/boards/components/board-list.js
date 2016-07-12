import React, { Component, PropTypes } from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import { injectIntl } from 'react-intl';

import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import Droppable from '../../../lib/dnd/droppable';
import Draggable from '../../../lib/dnd/draggable';

import pure from 'recompose/pure';
const iconButtonElement = (
	<IconButton iconClassName="material-icons">
		&#xE5D4;
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
	<FontIcon className="material-icons">&#xE25D;</FontIcon>
);

@pure
@injectIntl
export default class BoardList extends Component {
	static propTypes = {
		list: PropTypes.array.isRequired,
	};
	render() {
		const { list, intl } = this.props;
		const items = list
			// Debug only to make long list
			.reduce((aggregate, now) => {
				const filler = new Array(20);
				filler.fill(now);
				return aggregate.concat(filler);
			}, [])
			.map((item,i) => {
				const commonProps = {
					primaryText: item.name,
					secondaryText: intl.formatRelative(item.updatedAt),				};
				const preview = (
					<ListItem {...commonProps}
						leftIcon={dragHandle}
					/>
				);
				const draggableHandle = (
					<Draggable data={item} preview={preview}>{dragHandle}</Draggable>
				);
				const props = {
					...commonProps,
					leftIcon: draggableHandle,
					rightIconButton: iconMenu,
					onClick() {
						this::open(item.id);
					},
				};
				return (
					<Droppable key={i}
						onDragOver={({ descriptor }) => {}}
						onDrop={() => { console.log(item.id); }} >
						<div>
							<ListItem {...props} />
							<Divider />
						</div>
					</Droppable>
				);
			});
		return <div>{items}</div>;
	}
}

function open(val) {
	browserHistory.push(`/boards/${val}`);
}
