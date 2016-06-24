import React, { Component, PropTypes } from 'react';

export default class HomeView extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	};
	componentWillMount() {
		this.context.setTitle('Home');
	}
	render() {
		return (
			<div className="mdl-layout__content">Home</div>
		);
	}
}
