import React, { Component, PropTypes } from 'react';

export default class BoardView extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	}
	componentWillMount() {
		this.context.setTitle('Board Item View');
	}
	componentDidMount() {
		window.scrollTo(0, 1);
	}
	render() {
		return (
			<div>
				It is Board Item!
			</div>
		);
	}
}
