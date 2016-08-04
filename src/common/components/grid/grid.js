import Rx from 'rx';
import cx from 'classnames';
import Prefixer from 'inline-style-prefixer';
import isEqual from 'lodash/isEqual';
import isEqualWith from 'lodash/isEqualWith';
import React, { Component, Children, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { getViewportWidth } from '../../lib/dom-helpers';
import css from './grid.scss';

const debug = require('debug')('App.Component.Grid');

export default class Grid extends Component {
	static propTypes = {
		columnClassName: PropTypes.string,
		className: PropTypes.string,
		style: PropTypes.object,
	};
	componentWillMount() {
		this.state = {
			elementSizes: [],
			positions: [],
			columns: 0,
			renderSteps: 0,
		};
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (!isEqual(this.state, nextState)) {
			return true;
		}
		if (!isEqualWith(this.props, nextProps, isEqualWith)) {
			return true;
		}
		return false;
	}
	componentWillReceiveProps(nextProps) {
		if (!isEqualWith(this.props, nextProps, isEqualWith)) {
			this.setState({
				renderSteps: 0,
			});
		}
	}
	componentDidMount() {
		this.stylePrefixer = new Prefixer({ userAgent: navigator.userAgent });
		this.resizeSpy = Rx.Observable.fromEvent(window, 'resize')
			.debounce(200)
			.map(() => getViewportWidth())
			.distinctUntilChanged()
			.subscribe(() => {
				this.setState({ positions: [], renderSteps: 0 });
			});
		this.postRender();
	}
	componentDidUpdate() {
		this.postRender();
	}
	componentWillUnmount() {
		this.unregisterItemResizeHandlers();
		this.resizeSpy.dispose();
	}
	render() {
		const { style, className } = this.props;
		const rootClassName = cx(css.root, className);
		const items = this.renderItems();
		const dummys = this.renderDummys();

		return <div className={rootClassName} style={style}>
			{items}
			{dummys}
		</div>;
	}
	renderItems() {
		const { children } = this.props;
		const { positions } = this.state;
		if (!children || children.length === 0) {
			return null;
		}

		return Children.toArray(children)
			.map((child, index) => {
				return React.cloneElement(child, {
					key: child.props.id,
					ref: `item-${child.props.id}`,
					style: {
						margin: 0,
						...positions[index],
						...child.props.style
					},
					className: cx(css.item, child.props.className),
				});
			});
	}
	renderDummys() {
		const { columnClassName, children } = this.props;
		const { elementSizes, columns } = this.state;
		if (elementSizes.length === 0) {
			debug('Nothing to render');
			return null;
		}
		const dummys = Array.apply(null, { length: columns }).map(() => []);
		Children.toArray(children).forEach((child, index) => {
			const size = elementSizes[index];
			const ref = `dummy-${child.props.id}`;
			dummys[index % columns].push(
				<div ref={ref} key={index}
					className={cx(css.dummy, child.props.className)}
					style={{ width: '100%', height: size.height }} />
			);
		});
		return dummys.map((dummy, index) => {
			return (
				<div key={index} className={cx(columnClassName, css.column)}
					style={{margin: 0}}>
					{dummy}
				</div>
			);
		});
	}

	postRender() {
		debug('Post Render', this.state.renderSteps);
		switch (this.state.renderSteps) {
			case 0:
				return this.updateDummyElements();
			case 1:
				return this.updatePositions();
			case 2:
				return this.registerItemResizeHandlers();
		}
	}

	// Post-Step 1
	updateDummyElements() {
		const { children } = this.props;
		this.unregisterItemResizeHandlers();

		const nextState = { renderSteps: 1 };

		if (!children || children.length === 0) {
			return this.setState(nextState);
		}

		const containerWidth = findDOMNode(this).getBoundingClientRect().width;
		const items = Children.toArray(children)
			.map(child => this.refs[`item-${child.props.id}`]);

		const itemWidth = findDOMNode(items[0]).getBoundingClientRect().width;
		nextState.columns = Math.max(1, Math.floor(containerWidth / itemWidth));

		nextState.elementSizes = items.map(refId => {
			const element = findDOMNode(refId);
			const box = element.getBoundingClientRect();
			return { width: box.width, height: box.height };
		});

		this.setState(nextState);
	}

	// Post-Step 2
	updatePositions() {
		const { columns, elementSizes } = this.state;
		const nextState = { renderSteps: 2 };
		if (elementSizes.length === 0) {
			return this.setState(nextState);
		}
		const container = findDOMNode(this).getBoundingClientRect();
		nextState.positions = Children.toArray(this.props.children)
			.map(child => findDOMNode(this.refs[`dummy-${child.props.id}`]))
			.map((node, index) => {
				const box = node.getBoundingClientRect();
				const offsetX = Math.floor(index % columns) * 5;
				const offsetY = Math.floor(index / columns) * 0;
				const x = box.left + offsetX - container.left;
				const y = box.top + offsetY - container.top;
				const transform = `translate3d(${x}px, ${y}px, 0)`;
				return this.stylePrefixer.prefix({
					transform,
				});
			});
		this.setState(nextState);
	}

	// Post-Step 3
	// this is last step, won't want to render again.
	// So, I'll not change renderSteps
	registerItemResizeHandlers() {
		// dispose old handlers
		this.unregisterItemResizeHandlers();

		if (this.state.elementSizes.length === 0) return;

		this.resizeHandlers = Children.toArray(this.props.children)
			.map(child => {
				const node = findDOMNode(this.refs[`item-${child.props.id}`]);
				return Rx.Observable.interval(100)
					.map(() => node.getBoundingClientRect().height)
					.distinctUntilChanged()
					.skip(1)
					.debounce(100)
					.subscribe(() => this.updateDummyElements());
			});
	}

	unregisterItemResizeHandlers() {
		if (this.resizeHandlers) {
			this.resizeHandlers.forEach(handler => handler.dispose());
			delete this.resizeHandlers;
		}
	}
}
