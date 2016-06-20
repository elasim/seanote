import Rx from 'rx';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

// Content HOC
export default class ContentWrapper extends Component {
	componentDidMount() {
		const child = findDOMNode(this);
		this._scrollEventStream = Rx.Observable.fromEvent(child, 'scroll')
			.throttle(50)
			.subscribe((e) => {
				e.preventDefault();
				e.stopPropagation();
				if (child.scrollTop == 0) {
					document.body.scrollTop = 60;
					window.scrollTo(0, 60);
				}
				return false;
			});
	}
	componentWillUnmount() {
		this._scrollEventStream.dispose();
	}
	render() {
		return this.props.children;
	}
}
