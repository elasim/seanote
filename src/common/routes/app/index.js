import React from 'react';
import { Link } from 'react-router';
import '../../lib/universal-db';

import './style.css';

export default function (props) {
	return (
		<div className="menu">
			App
			<Link to="/">Home</Link>
			<Link to="/about">About</Link>
			<Link to="/not-found">Not-Found</Link>
			{props.children}
		</div>
	);
}
