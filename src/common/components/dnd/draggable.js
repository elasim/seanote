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
		press: PropTypes.bool,
	};
	componentDidMount() {
		this.dragDescriptor = {
			source: this,
			element: findDOMNode(this),
			data: this.props.data,
			type: this.props.type,
			press: this.props.press
		};
		this.context.hammer.registerDraggable(this.dragDescriptor);
	}
	componentDidUpdate() {
		this.dragDescriptor.element = findDOMNode(this);
	}
	componentWillReceiveProps(nextProps) {
		['data', 'type', 'press'].forEach(key => {
			if (this.dragDescriptor[key] !== nextProps[key]){
				this.dragDescriptor[key]= nextProps[key];
			}
		});
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
