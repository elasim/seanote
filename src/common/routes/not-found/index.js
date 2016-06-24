import React, { Component, PropTypes } from 'react';

export default class Error extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	};
	render() {
		return (
			<div className="mdl-layout__content">404 NOT FOUND</div>
		);
	}
	componentWillMount() {
		this.context.setTitle('Error');
	}
}
