import React, { Component, PropTypes } from 'react';
import Child from './child.js';

export default class App extends Component {
	render() {
		return (
			<div>
			Good
				<Child />
			</div>
		);
	}
}
