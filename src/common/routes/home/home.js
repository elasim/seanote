import React, { Component, PropTypes } from 'react';

import css from './home.scss';

export default class HomeView extends Component {
	static contextTypes = {
		setTitle: PropTypes.func.isRequired,
	};
	componentWillMount() {
		this.context.setTitle('Home');
	}
	render() {
		return (
			<div>
				<h2>Welcome!</h2>
				<div clasasName={css.section}>
					<h3>You can use Seanote Anywhere</h3>
					<p>
						Seanote will work even offline.<br/>
						It will save your data when it available
					</p>
				</div>
				<div clasasName={css.section}>
					<h3>You can use Seanote Anywhere</h3>
					<p>
						Seanote will work even offline.<br/>
						It will save your data when it available
					</p>
				</div>
			</div>
		);
	}
}
