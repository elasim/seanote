import React from 'react';
import { Link } from 'react-router';

export default function (props) {
	return (
		<div>
			App
			<Link to="/">Home</Link>
			<Link to="/about">About</Link>
			<Link to="/not-found">Not-Found</Link>
			{props.children}
		</div>
	);
}
