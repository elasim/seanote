import React, { Component, PropTypes } from 'react';
import Prefixer from 'inline-style-prefixer';

export default class Dim extends Component {
	static propTypes = {
		active: PropTypes.bool,
	};
	componentDidMount() {
		this.prefixer = new Prefixer(navigator.userAgent);
	}
	render() {
		const { active, style, ...props } = this.props;
		const styles = {
			position: 'fixed',
			top: -30,
			left: 0,
			right: 0,
			opacity: 0,
			backgroundColor: '#333',
			transition: 'opacity 0.15s linear',
			...style
		};
		if (active) {
			Object.assign(styles, {
				bottom: 0,
				top: 0,
				opacity: 0.5,
			});
		}
		if (this.prefixer) {
			const prefixed = this.prefixer.prefix(styles);
			Object.assign(styles, prefixed);
		}

		return <div style={styles} {...props} />;
	}
}
