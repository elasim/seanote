import cx from 'classnames';
import React from 'react';
import css from './list.scss';

function ListItem(props) {
	return (
		<li>{props.data.name}</li>
	);
}

export default function List(props) {
	const { style, className } = props;
	const testdata = [
		// room info info
		{
			id: 1,
			name: 'Test Chat Room 1',
			users: [
				'admin',
				'tester1',
				'test2'
			],
		},
		{
			id: 2,
			name: 'Test Chat Room 2',
			users: [
				'admin',
				'test2',
			],
		},
		{
			id: 3,
			name: 'Supports',
			users: [
				'tester1',
				'seanote-supports',
			],
		},
	];
	const listItems = testdata.map(room => {
		return (
			<ListItem key={room.id} data={room}/>
		);
	});
	const rootProps = {
		className: cx(css.root, className),
		style,
	};
	return (
		<ul {...rootProps}>
			{listItems}
		</ul>
	);
}
