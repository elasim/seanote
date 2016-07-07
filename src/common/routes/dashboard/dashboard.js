import request from '../../lib/request';
import React, { Component, PropTypes } from 'react';

export default class BoardDashboard extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	}
	constructor(...args) {
		super(...args);
		this.state = {
			data: null
		};
	}
	componentWillMount() {
		this.context.setTitle('Overview');
	}
	render() {
		return (
			<div>
				<xmp>{JSON.stringify(this.state.data,0,4)}</xmp>
				<button onClick={::this.send}>{this.props.route.foo}</button>
			</div>
		);
	}
	async send() {
		const res = await request.get('/api/user');
		const data = await res.json();
		this.setState({
			data
		});
	}
}
