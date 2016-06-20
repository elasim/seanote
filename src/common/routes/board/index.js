import React, { Component } from 'react';
import { connect } from 'react-redux';

@connect(null, (dispatch) => ({
	setTitle(title) {
		dispatch({ type: 'setTitle', payload: title });
	},
}))
export default class Board extends Component {
	componentWillMount() {
		this.props.setTitle('Board');
	}
	render() {
		return (
			<div className="mdl-layout__content">
				BOARD MAIN
				{this.props.children}
			</div>
		);
	}
}
