import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

export default class Draggable extends Component {
	static contextTypes = {
		hammer: PropTypes.object,
	};
	static propTypes = {
		preview: PropTypes.element,
	};
	componentDidMount() {
		this.dragDescriptor = {
			source: this,
			element: findDOMNode(this)
		};
		this.context.hammer.registerDraggable(this.dragDescriptor);
	}
	componentWillUnmount() {
		this.context.hammer.unregisterDraggable(this.dragDescriptor);
		this.dragDescriptor = null;
	}
	render() {
		const { children, ...props } = this.props;
		Object.keys(Draggable.propTypes).forEach(key => delete props[key]);
		return React.cloneElement(children, props);
	}
}
