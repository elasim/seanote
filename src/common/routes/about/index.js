import React, { Component } from 'react';
import { connect } from 'react-redux';

@connect(null, (dispatch) => ({
	setTitle(title) {
		dispatch({ type: 'setTitle', payload: title });
	}
}))
export default class AboutView extends Component {
	componentWillMount() {
		this.props.setTitle('About');
	}
	render() {
		return (
			<div className="mdl-layout__content">ABOUT</div>
		);
	}
}
