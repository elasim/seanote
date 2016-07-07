import React, { Component } from 'react';

import SortableList from '../../components/sortable-list';
import ListItemTemplate from './list-item-template';

export default class BoardList extends Component {
	constructor(...args) {
		super(...args);
		this.onListMove = ::this.onListMove;
		this.state = {
			items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => ({ id: v })),
		};
	}
	render() {
		return (
			<SortableList items={this.state.items} keyName="id"
				ref="list"
				style={{ width: 'auto', padding: 5 }}
				template={ListItemTemplate}
				disableHandle
				disablePreview
				onDragMove={this.onListMove} />
		);
	}   
	onListMove(src, dst) {
		const items = [].concat(this.state.items);
		const data = items[src];
		items.splice(src, 1);
		items.splice(dst, 0, data);
		this.setState({ items });
	}
}
