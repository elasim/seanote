import Rx from 'rx';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import BoardListItem from './list-item';
import './style.scss';

import Board from '../../models/board';

@connect(null, (dispatch) => ({
	setTitle(title) {
		dispatch({ type: 'setTitle', payload: title });
	},
}))
export default class BoardList extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			listWidth: undefined,
			items: Board.all(), /// FIX IT
			positions: [],
		};
	}
	componentWillMount() {
		this.props.setTitle('Board');
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
			this.adjustBoardPositions();
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
			positions: newPositions,
			itemWidth: sampleSize.width,
			colWide,
		});
	}
	render() {
		const style = { width: this.state.listWidth };
		const items = this.state.items.map((item, i) => {
			return (
				<BoardListItem key={item.id} data={item} ref={item.id}
					style={this.state.positions[i]} />
			);
		});
		return (
			<div className="mdl-layout__content view board-list">
				<div className="list" style={style} ref="list">
					{items}
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
	const width = rect.width + margin.width + border.width;
	const height = rect.height + margin.height + border.height;
	return { width, height, margin, padding, border };
}
