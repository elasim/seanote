import React from 'react';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

function renderButton() {
	return (
		<IconButton style={{
			padding: 0,
			margin: 0,
			width: 24,
			height: 24,
		}}><MoreVertIcon /></IconButton>
	);
}

export default function MenuButton(props) {
	return (
		<IconMenu iconButtonElement={renderButton()} style={props.style}>
			<MenuItem primaryText="Close"/>
			<MenuItem primaryText="Delete"/>
		</IconMenu>
	);
}
