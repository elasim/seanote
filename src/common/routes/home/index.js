import React, { Component } from 'react';
import { connect } from 'react-redux';
@connect(null, (dispatch) => ({
	setTitle(title) {
		dispatch({ type: 'setTitle', payload: title });
	}
}))
export default class HomeView extends Component {
	componentWillMount() {
		this.props.setTitle('Home');
	}
	render() {
		return (
			<div className="mdl-layout__content">Home</div>
		);
	}
}
