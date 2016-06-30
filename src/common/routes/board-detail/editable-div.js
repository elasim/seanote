import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import _ from 'lodash';

export default class EditableDiv extends Component {
	static propTypes = {
		onChange: PropTypes.func,
		defaultValue: PropTypes.string,
	};
	static defaultProps = {
		onChange: emptyFunction,
		defaultValue: '',
	};
	constructor(props, context) {
		super(props, context);
		this.state = {
			editable: false,
		};
		_.bindAll(this, [
			'onClick',
			'onBlur',
			'onKeyDown',
		]);
	}
	render() {
		const {
			onClick,
			onBlur,
			onKeyDown,
			state: { editable },
			props: { className, style, },
		} = this;
		return (
			<div className={className} style={style}
				onClick={onClick}
				onBlur={onBlur}
				onKeyDown={onKeyDown}
				contentEditable={editable}
				dangerouslySetInnerHTML={{__html:this.props.defaultValue}}/>
		);
	}
	onClick(e) {
		e.preventDefault();
		this.setState({
			editable: true
		});
		setTimeout(e.target::e.target.focus, 0);
		if (this.props.onClick) {
			this.props.onClick(e);
		}
	}
	onBlur(e) {
		this.setState({
			editable: false
		});
		this.onChange(e.target.innerHTML);
		if (this.props.onBlur) {
			this.props.onBlur(e);
		}
	}
	onKeyDown(e) {
		const { onKeyDown } = this.props;
		if (e.keyCode === 13) {
			e.preventDefault();
			this.onChange(e.target.innerHTML);
			e.target.blur();
			return;
		}
		if (onKeyDown) {
			onKeyDown(e);
		}
	}
	onChange(text) {
		if (this.props.defaultValue !== text) {
			this.props.onChange(text);
		}
	}
}
