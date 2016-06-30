import React, { Component, PropTypes } from 'react';

export default class BoardDashboard extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	}
	render() {
		return (
			<div>Board Dashboard</div>
		);
	}
	componentWillMount() {
		this.context.setTitle('Overview');
	}
}
