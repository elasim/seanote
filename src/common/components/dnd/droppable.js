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
		delay: PropTypes.number,
	};
	static defaultProps = {
		onDragOver: emptyFunction,
		onDragOut: emptyFunction,
		onDrop: emptyFunction,
		delay: 0,
	};
	componentWillMount() {
		this.state = {
			isHover: false,
		};
		this.timer = null;
	}
	componentWillReceiveProps() {
		clearTimeout(this.timer);
		this.timer = null;
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
		clearTimeout(this.timer);
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
	const { delay, onDragOver, onDragOut } = this.props;
	const element = findDOMNode(this);

	if (target !== element) {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		if (isHover) {
			this::onDragOut(event, descriptor);
			this.setState({ isHover: false });
		}
		return;
	}

	if (!isHover) {
		if (delay > 0 && this.timer === null) {
			this.timer = setTimeout(() => {
				this.timer = null;
				this::onDragOver(event, descriptor);
			}, delay);
		} else if (delay === 0) {
			this::onDragOver(event, descriptor);
		}
		this.setState({
			isHover: true,
		});
	}
}

function end({ descriptor, event }) {
	if (this.timer) {
		clearTimeout(this.timer);
		this.timer = null;
	}
	if (this.state.isHover) {
		const { props: { onDrop } } = this;
		this::onDrop(event, descriptor);
		this.setState({
			isHover: false
		});
	}
}
