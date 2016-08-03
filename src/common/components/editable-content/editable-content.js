import Rx from 'rx';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import emptyFunction from 'fbjs/lib/emptyFunction';

export default class EditableContent extends Component {
	static propTypes = {
		style: PropTypes.object,
		className: PropTypes.string,
		onChanged: PropTypes.func,
		value: PropTypes.string,
	};
	static defaultProps = {
		onChanged: emptyFunction,
	};
	componentWillMount() {
		this.state = {
			editable: false
		};
		this.onClick = ::this.onClick;
		this.onBlur = ::this.onBlur;
		this.onFocus = ::this.onFocus;
	}
	componentDidUpdate() {
		const element = findDOMNode(this);
		element.scrollLeft = 0;
		if (this.state.editable) {
			element.focus();
		}
	}
	componentWillUnmount() {
		this.unregisterKeyboardHandler();
	}
	render() {
		const { style, className, value } = this.props;
		const { editable } = this.state;
		// @issue: (hotfix) prevent crash with ellipsis
		const rootStyle = editable ? {
			...style,
			textOverflow: 'clip'
		} : style;
		return (
			<div style={rootStyle} className={className}
				dangerouslySetInnerHTML={{__html:value}}
				contentEditable={editable}
				onClick={this.onClick}
				onBlur={this.onBlur}
				onFocus={this.onFocus}
			/>
		);
	}
	onClick(event) {
		event.preventDefault();
		if (!this.state.editable) {
			this.beginChange();
		}
	}
	onBlur() {
		this.applyChange();
	}
	onFocus() {
		document.execCommand('selectAll', false, null);
	}
	beginChange() {
		this.registerKeyboardHandler();
		this.setState({
			editable: true,
		});
	}
	endChange() {
		this.unregisterKeyboardHandler();
		this.setState({
			editable: false
		});
	}
	applyChange() {
		if (this.state.editable) {
			const { value, onChanged } = this.props;
			const nextValue = findDOMNode(this).textContent;
			if (value !== nextValue && onChanged(this, nextValue)) {
				this.endChange();
			} else {
				this.cancelChange();
			}
		}
	}
	cancelChange() {
		if (this.state.editable) {
			this.endChange();
			findDOMNode(this).innerHTML = this.props.value;
		}
	}
	registerKeyboardHandler() {
		const element = findDOMNode(this);
		this.eventHandler = Rx.Observable.fromEvent(element, 'keydown')
			.subscribe(event => {
				switch (event.keyCode) {
					case 13:
						return this.applyChange();
					case 27:
						return this.cancelChange();
				}
			});
	}
	unregisterKeyboardHandler() {
		if (this.evnetHandler) {
			this.eventHandler.dispose();
			delete this.eventHandler;
		}
	}
}
