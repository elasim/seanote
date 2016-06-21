import cx from 'classnames';
import Rx from 'rx';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import css from './style.scss';

const REF_PREFIX = 'tight-grid-item-';

export default class TightGrid extends Component {
	static propTypes = {
		items: PropTypes.arrayOf(PropTypes.any).isRequired,
		className: PropTypes.oneOfType([
			PropTypes.string, PropTypes.object
		]),
		childClass: PropTypes.oneOfType([
			PropTypes.string, PropTypes.object
		]).isRequired,
		childElement: PropTypes.any.isRequired,
		childProps: PropTypes.object,
	};
	constructor(props, context) {
		super(props, context);
		this.state = {
			listWidth: undefined,
			positions: []
		};
	}
	componentDidMount() {
		if (process.env.BROWSER) {
			this._resizeHandler = ::this.adjustBoardPositions;
			this._deferredResize = () => {
				setTimeout(::this.adjustBoardPositions, 1000);
			};
			this._resizeEventStream = Rx.Observable.fromEvent(window, 'resize')
				.throttle(100)
				.subscribe(this._resizeHandler);
			window.addEventListener('orientationchange', this._deferredResize, false);
			setTimeout(::this.adjustBoardPositions, 500);
		}
	}
	componentWillUnmount() {
		if (process.env.BROWSER) {
			this._resizeEventStream.dispose();
			window.removeEventListener('orientationchange', this._deferredResize);
		}
	}
	adjustBoardPositions() {
		const { items } = this.props;
		if (!items || items.length === 0) {
			return;
		}
		const clientWidth = findDOMNode(this).parentNode.clientWidth;

		// find sample to compute item width
		const box = getContainerSize(findDOMNode(this.refs[REF_PREFIX + '0']));
		const vSpace = Math.floor(box.margin.height / 2 + box.border.height);

		// compute number of columns
		const colWide = Math.max(Math.floor(clientWidth / box.width), 1);

		// get list container width
		const listBox = getContainerSize(findDOMNode(this.refs.list));
		const listWidth = (colWide > 1)
			? (box.width * colWide) : (clientWidth - listBox.padding.width);

		// compute new item positions
		const newPositions = [];
		const columnTopOffsets = new Array(colWide);
		columnTopOffsets.fill(0);

		for (let i = 0; i < items.length; ++i) {
			const elem = findDOMNode(this.refs[REF_PREFIX + i]);
			const rect = elem.getBoundingClientRect();
			newPositions.push({
				left: (i % colWide) * box.width,
				top: columnTopOffsets[i % colWide]
			});
			const height = rect.height + vSpace;
			columnTopOffsets[i % colWide] += height;
		}
		this.setState({
			listWidth,
			positions: newPositions,
			colWide,
		});
	}
	render() {
		const { listWidth, positions } = this.state;
		const {
			items,
			className,
			childClass,
			childElement
		} = this.props;
		const renderedItems = items.map((item, i) => {
			return (
				<div ref={REF_PREFIX + i} key={i} style={positions[i]}
					className={cx(css.item, childClass)}>
					{React.createElement(childElement, { data: item })}
				</div>
			);
		});
		return (
			<div className={cx(css.list, className)} style={{
				width: listWidth
			}} ref="list">
				{renderedItems}
				{this.props.children}
			</div>
		);
	}
}

// helper function
export function getContainerSize(element) {
	const rect = element.getBoundingClientRect();
	const style = element.currentStyle || window.getComputedStyle(element);
	const margin = {
		width: parseFloat(style.marginLeft) + parseFloat(style.marginRight),
		height: parseFloat(style.marginTop) + parseFloat(style.marginBottom)
	};
	const padding = {
		width: parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
		height: parseFloat(style.paddingTop) + parseFloat(style.paddingBottom),
	};
	const border = {
		width: parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth),
		height: parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth),
	};
	const content = {
		width: parseFloat(style.width),
		height: parseFloat(style.height),
	};
	const width = rect.width + margin.width + border.width;
	const height = rect.height + margin.height + border.height;
	return { width, height, margin, padding, border, content };
}
