import cx from 'classnames';
import Rx from 'rx';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import DragDropContext from '../../components/drag-drop-context';
import BoardItemList, { dragItemType } from '../../components/board';
import css from './style.scss';

import Board from '../../models/board';

console.log(dragItemType);

@connect(null, (dispatch) => ({
	setTitle(title) {
		dispatch({ type: 'setTitle', payload: title });
	},
}))
@DragDropContext('BoardDetailItem', {
	hover(props, monitor, component) {
		// Scroll on edge
		const dom = findDOMNode(component);
		const bound = dom.getBoundingClientRect();
		const cursor = monitor.getSourceClientOffset();
		const edgeHeight = Math.floor(bound.height * 0.1);
		const top = bound.top + edgeHeight;
		const bottom = bound.height - edgeHeight;
		clearInterval(component._hoverScroll);

		if (cursor.y <= top) {
			component._hoverScroll = setInterval(() => {
				dom.scrollTop += cursor.y - top;
			});
			return;
		}
		if (cursor.y >= bottom) {
			component._hoverScroll = setInterval(() => {
				dom.scrollTop += cursor.y - bottom;
			}, 30);
			return;
		}
	},
	drop(drop, monitor, component) {
		clearInterval(component._hoverScroll);
		console.log(monitor.didDrop());
		return;
	},
})
export default class BoardView extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			listWidth: undefined,
			previewWidth: undefined,
			items: Board.all(), /// FIX IT
			positions: [],
		};
	}
	componentWillMount() {
		this.props.setTitle('Board Impl2');
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
		if (!this.state.items || this.state.items.length === 0) {
			return;
		}
		const clientWidth = document.body.clientWidth;

		// find sample to compute item width
		const sampleId = this.state.items[0].id;
		const sampleSize = getElementContainerSize(findDOMNode(this.refs[sampleId]));

		const colWide = Math.max(Math.floor(clientWidth / sampleSize.width), 1);

		const listSize = getElementContainerSize(findDOMNode(this.refs.list));
		const listWidth = (colWide > 1)
			? (sampleSize.width * colWide) : (clientWidth - listSize.padding.width);

		const newPositions = [];
		const accumulatedTopOffsets = new Array(colWide);
		accumulatedTopOffsets.fill(0);

		for (let i = 0; i < this.state.items.length; ++i) {
			const elem = findDOMNode(this.refs[this.state.items[i].id]);
			const clientRect = elem.getBoundingClientRect();
			newPositions[i] = {
				left: (i % colWide) * sampleSize.width,
				top: accumulatedTopOffsets[i % colWide]
			};

			const height = clientRect.height
				+ sampleSize.margin.height / 2
				+ sampleSize.border.height;
			accumulatedTopOffsets[i % colWide] += height;
		}
		this.setState({
			listWidth,
			previewWidth: sampleSize.content.width,
			positions: newPositions,
			colWide,
		});
	}
	render() {
		const { connectDropTarget, dropTargetMonitor } = this.props;
		const { listWidth, previewWidth } = this.state;
		const listStyle = { width: listWidth };
		const previewStyle = { width: previewWidth };
		const items = this.state.items.map((item, i) => {
			return (
				<div ref={item.id} key={item.id} style={this.state.positions[i]}
					className={cx(css.item, 'mdl-shadow--2dp')}>
					<div className={css['item-header']}>{item.name}</div>
					<BoardItemList data={Board.getDetails(item.id)}
						notifyPreviewChanged={::this.props.onPreviewChanged} />
				</div>
			);
		});
		let preview = null;
		if (this.props.preview && dropTargetMonitor.getItemType() !== undefined) {
			const Layer = this.props.preview.layer;
			const renderer = this.props.preview.renderer;
			preview = <Layer component={renderer} style={previewStyle}/>;
		}
		return connectDropTarget(
			<div className={cx('mdl-layout__content', css.root)}>
				<div className={css.list} style={listStyle} ref="list">
					{items}
					{preview}
				</div>
			</div>
		);
	}
}

function getElementContainerSize(element) {
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
