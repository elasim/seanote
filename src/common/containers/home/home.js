import React, { Component, PropTypes } from 'react';
import pure from 'recompose/pure';
import css from './home.scss';

class HomeView extends Component {
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
				<div className={css.section}>
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

export default pure(HomeView);
