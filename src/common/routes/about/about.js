import React, { Component, PropTypes } from 'react';

export default class AboutView extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	}
	componentWillMount() {
		this.context.setTitle('About');
	}
	componentDidMount() {
		window.scrollTo(0, 1);
	}
	render() {
		return (
			<div className="mdl-layout__content">ABOUT</div>
		);
	}
}
