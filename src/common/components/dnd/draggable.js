import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import emptyFunction from 'fbjs/lib/emptyFunction';
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
		onDragStart: PropTypes.func,
		onDragEnd: PropTypes.func,
	};
	static defaultProps = {
		press: false,
		onDragStart: emptyFunction,
		onDragEnd: emptyFunction,
	}
	componentDidMount() {
		this.dragDescriptor = {
			source: this,
			element: findDOMNode(this),
			data: this.props.data,
			type: this.props.type,
			press: this.props.press
		};
		this.context.hammer.registerDraggable(this.dragDescriptor);
		this.disposeHook = this.context.hammer.createHook(
			::this.onDragStart,
			null,
			::this.onDragEnd);
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
		this.disposeHook();
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
	onDragStart(event) {
		if (event.descriptor.source === this) {
			this.props.onDragStart(event, this.dragDescriptor);
		}
	}
	onDragEnd(event) {
		if (event.descriptor.source === this) {
			this.props.onDragEnd(event, this.dragDescriptor);
		}
	}
}
