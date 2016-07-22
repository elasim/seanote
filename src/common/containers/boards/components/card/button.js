import React from 'react';
import Button from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

function renderButton() {
	return (
		<Button style={{
			padding: 0,
			margin: 0,
			width: 24,
			height: 24,
		}}><MoreVertIcon /></Button>
	);
}

export default function MenuButton(props) {
	return (
		<IconMenu iconButtonElement={renderButton()} style={props.style}>
			<MenuItem primaryText="Add Card"/>
			<MenuItem primaryText="Close"/>
			<MenuItem primaryText="Delete"/>
		</IconMenu>
	);
}
