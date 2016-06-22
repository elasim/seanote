import { Component, Children, PropTypes } from 'react';

export default class AppContext extends Component {
	static childContextTypes = {
		setTitle: PropTypes.func,
		getTitle: PropTypes.func,
	};
	getChildContext() {
		return this.props.context;
	}
	render() {
		return Children.only(this.props.children);
	}
}
