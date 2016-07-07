import React, { Component, PropTypes } from 'react';

export default class ErrorView extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	};
	render() {
		return (
			<div>
				FUCK YOU
			</div>
		);
	}
	componentWillMount() {
		this.context.setTitle('Error');
	}
}

