import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import isEqual from 'lodash/isEqual';

export default class Draggable extends Component {
	static contextTypes = {
		hammer: PropTypes.object,
	};
	static propTypes = {
		preview: PropTypes.element,
		data: PropTypes.object,
		type: PropTypes.string,
	};
	componentDidMount() {
		this.dragDescriptor = {
			source: this,
			element: findDOMNode(this),
			data: this.props.data,
			type: this.props.type,
		};
		this.context.hammer.registerDraggable(this.dragDescriptor);
	}
	componentDidUpdate() {
		this.dragDescriptor.element = findDOMNode(this);
	}
	componentWillReceiveProps(nextProps) {
		if (this.dragDescriptor.data !== nextProps.data) {
			this.dragDescriptor.data = nextProps.data;
		}
		if (this.dragDescriptor.type !== nextProps.type) {
			this.dragDescriptor.type = nextProps.type;
		}
	}
	componentWillUnmount() {
		this.context.hammer.unregisterDraggable(this.dragDescriptor);
		this.dragDescriptor = null;
	}
	shouldComponentUpdate(nextProps) {
		const { data, preview } = this.props;
		return nextProps.preview !== preview || !isEqual(nextProps.data, data);
	}
	render() {
		const { children, ...props } = this.props;
		Object.keys(Draggable.propTypes).forEach(key => delete props[key]);
		return React.cloneElement(children, props);
	}
}
