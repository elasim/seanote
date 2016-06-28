import React, { Component } from 'react';
import { connect } from 'react-redux';

class Boards extends Component {
	constructor(props, context) {
		super(props, context);
	}
	render() {
		return (
			<div className="mdl-layout__content">
				DataContext
			</div>
		);
	}
}

export default connect(
	state => {
		return {};
	},
	dispatch => {
		return {};
	},
)(Boards);
