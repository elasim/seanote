import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { findDOMNode } from 'react-dom';

export default class Droppable extends Component {
	static contextTypes = {
		hammer: PropTypes.object,
	};
	static propTypes = {
		onDragOver: PropTypes.func,
		onDragOut: PropTypes.func,
		onDrop: PropTypes.func,
		render: PropTypes.func,
	};
	static defaultProps = {
		onDragOver: emptyFunction,
		onDragOut: emptyFunction,
		onDrop: emptyFunction,
	};
	componentWillMount() {
		this.state = {
			isHover: false
		};
	}
	componentDidMount() {
		this.dropDescriptor = {
			source: this,
			element: findDOMNode(this)
		};
		this.context.hammer.registerDroppable(this.dropDescriptor);
		this.disposeHook = this.context.hammer.createHook(null, this::move, this::end);
	}
	componentWillUnmount() {
		this.context.hammer.unregisterDroppable(this.dropDescriptor);
		this.dropDescriptor = null;
		this.disposeHook();
	}
	render() {
		const { children, ...props } = this.props;
		Object.keys(Droppable.propTypes).forEach(key => delete props[key]);
		if (this.props.render) {
			return this.props.render(props, this.state);
		} else {
			return React.cloneElement(children, props);
		}
	}
}

function move({ descriptor, event, target }) {
	const { isHover } = this.state;
	let node = target;
	const element = findDOMNode(this);
	while (node && node !== element && node !== document.body) {
		node = node.parentNode;
	}
	if (node === document.body || !node) {
		if (isHover) {
			const { props: { onDragOut } } = this;
			this::onDragOut(event, descriptor);
			this.setState({
				isHover: false,
			});
		}
		return;
	}
	if (!isHover) {
		const { props: { onDragOver } } = this;
		this::onDragOver(event, descriptor);
		this.setState({
			isHover: true
		});
	}
}

function end({ descriptor, event }) {
	if (this.state.isHover) {
		const { props: { onDrop } } = this;
		this::onDrop(event, descriptor);
		this.setState({
			isHover: false
		});
	}
}
