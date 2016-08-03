import Rx from 'rx';
import cx from 'classnames';
import Prefixer from 'inline-style-prefixer';
import isEqual from 'lodash/isEqual';
import React, { Component, Children, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
// import pure from 'recompose/pure';
import { getViewportWidth } from '../../lib/dom-helpers';
import css from './grid.scss';

const debug = require('debug')('App.Component.Grid');

export class GridItem extends Component {
	static propTypes = {
		id: PropTypes.string,
	};
	render() {
		const { className, style } = this.props;
		const rootClassName = cx(css.item, className);
		return (
			<div className={rootClassName} style={style}>
				{this.props.children}
			</div>
		);
	}
}

export class Grid extends Component {
	componentWillMount() {
		this.state = {
			elementSizes: [],
			positions: [],
			columns: 0,
		};
		this.steps = 0;
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !isEqual(this.props, nextProps) || isEqual(this.state, nextState);
	}
	componentWillReceiveProps() {
		this.steps = 0;
	}
	componentDidMount() {
		this.stylePrefixer = new Prefixer({ userAgent: navigator.userAgent });
		this.resizeSpy = Rx.Observable.fromEvent(window, 'resize')
			.debounce(200)
			.map(() => getViewportWidth())
			.distinctUntilChanged()
			.subscribe(() => {
				this.steps = 0;
				this.setState({ positions: [] });
			});
	}
	componentDidUpdate() {
		switch (this.steps) {
			case 0:
				return this.updateDummyElements();
			case 1:
				return this.updatePositions();
			case 2:
				return this.registerResizeHandlers();
		}
	}
	componentWillUnmount() {
		this.unregisterResizeHandlers();
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
		if (!children) return null;

		return Children.toArray(children)
			.map((child, index) => {
				let position = this.state.positions[index];

				return React.cloneElement(child, {
					key: child.props.id,
					ref: `item-${child.props.id}`,
					style: {
						margin: 0,
						...position,
						...child.props.style
					},
					className: cx(css.item, child.props.className),
				});
			});
	}
	renderDummys() {
		const { columnClassName } = this.props;
		const { elementSizes, columns } = this.state;
		if (elementSizes.length === 0) {
			return null;
		}
		const dummys = Array.apply(null, { length: columns }).map(() => []);
		Children.toArray(this.props.children).forEach((child, index) => {
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

	// Post-Step 1. Compute Heights
	updateDummyElements() {
		this.steps = 1;

		if (this.resizeHandlers) {
			this.unregisterResizeHandlers();
		}
		if (!this.props.children) return;
		console.log('Update Dummy');

		// Clear items
		const containerWidth = findDOMNode(this).getBoundingClientRect().width;
		const items = Children.toArray(this.props.children)
			.map(child => this.refs[`item-${child.props.id}`]);

		if (!items.length) {
			return;
		}

		const itemWidth = findDOMNode(items[0]).getBoundingClientRect().width;
		const columns = Math.max(1, Math.floor(containerWidth / itemWidth));

		const elementSizes = items.map(refId => {
			const element = findDOMNode(refId);
			const box = element.getBoundingClientRect();
			return { width: box.width, height: box.height };
		});

		this.setState({
			elementSizes,
			columns,
		});
	}

	// Post-Step 2. Set Transforms
	updatePositions() {
		this.steps = 2;
		if (this.state.elementSizes.length === 0) return;
		console.log('Update Position');

		const container = findDOMNode(this).getBoundingClientRect();
		const positions = Children.toArray(this.props.children)
			.map(child => findDOMNode(this.refs[`dummy-${child.props.id}`]))
			.map((node, index) => {
				const box = node.getBoundingClientRect();
				const offsetX = Math.floor(index % this.state.columns) * 5;
				const offsetY = Math.floor(index / this.state.columns) * 0;
				const x = box.left + offsetX - container.left;
				const y = box.top + offsetY - container.top;
				const transform = `translate3d(${x}px, ${y}px, 0)`;
				return this.stylePrefixer.prefix({
					transform,
					// width: box.width,
					// height: box.height,
				});
			});
		this.setState({
			positions,
		});
	}

	// Post-Step 3. registerResizeHandlers
	registerResizeHandlers() {
		this.steps = 3;

		if (this.state.elementSizes.length === 0) return;
		console.log('Register Handlers');

		this.resizeHandlers = Children.toArray(this.props.children)
			.map(child => {
				const node = findDOMNode(this.refs[`item-${child.props.id}`]);
				const dummy = findDOMNode(this.refs[`item-${child.props.id}`]);

				return Rx.Observable.interval(100)
					.map(() => node.getBoundingClientRect().height)
					.distinctUntilChanged()
					.skip(1)
					.debounce(100)
					.subscribe(() => this.updateDummyElements());
			});
	}

	unregisterResizeHandlers() {
		this.resizeHandlers.forEach(handler => handler.dispose());
		delete this.resizeHandlers;
	}
}
