import React, { Component, PropTypes } from 'react';

export default class AboutView extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	}
	render() {
		return (
			<div className="mdl-layout__content">ABOUT</div>
		);
	}
	componentWillMount() {
		this.context.setTitle('About');
	}
}
