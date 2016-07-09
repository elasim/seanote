import React, { Component } from 'react';
import Subheader from 'material-ui/Subheader';
import { List, ListItem } from 'material-ui/List';

class Boards extends Component {
	render() {
		return (
			<List>
				<Subheader>Board</Subheader>
				<ListItem>
					<p>Hello World</p>
				</ListItem>
			</List>
		);
	}
}

export default Boards;