import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import HammerAdapter from './adapter';

export default class Container extends Component {
	static childContextTypes = {
		hammer: PropTypes.object,
	};
	static propTypes = {
		touchAction: PropTypes.string,
		threshold: PropTypes.number,
		pointers: PropTypes.number,
	};
	static defaultProps = {
		touchAction: 'pan-y',
		threshold: 0,
		pointers: 1,
	};
	getChildContext() {
		return { hammer: this.adapter };
	}
	componentWillMount() {
		this.adapter = new HammerAdapter();
	}
	componentDidMount() {
		const { touchAction, threshold, pointers } = this.props;
		this.adapter.initialize(findDOMNode(this), {
			touchAction,
			threshold,
			pointers,
		});
	}
	componentWillUnmount() {
		this.adapter.destroy();
	}
	render() {
		const { children, ...props } = this.props;
		Object.keys(Container.propTypes).forEach(key => delete props[key]);

		return React.cloneElement(children, props);
	}
}
