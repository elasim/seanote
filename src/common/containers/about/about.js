import React, { Component, PropTypes } from 'react';
import pure from 'recompose/pure';

class AboutView extends Component {
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
			<div>
				<section>
					<h2>Seanote is...</h2>
					<p>I designed seanote to help managing your project</p>
				</section>
				<section>
					<h2>It still underdeveloping</h2>
					<p></p>
				</section>
			</div>
		);
	}
}

export default pure(AboutView);
