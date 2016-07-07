import React, { Component, PropTypes } from 'react';

export default class Setting extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	}
	render() {
		return (
			<div>Board Settings</div>
		);
	}
	componentWillMount() {
		this.context.setTitle('Setting');
	}
}

