import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ComponentEx from '../../../component';
import Symbol from '../../../../lib/symbol-debug';

const debug = require('debug')('Component::Card.Input');

const EventTypes = {
	Submit: Symbol('Input.Submit'),
};

export default class Input extends ComponentEx {
	static propTypes = {
		id: PropTypes.string,
	};
	static EventTypes = EventTypes;
	componentWillMount() {
		this.onKeyDown = ::this.onKeyDown;
		this.submit = ::this.submit;
	}
	render() {
		return (
			<div style={{ display: 'flex' }}>
				<TextField rowsMax={3} fullWidth multiLine
					style={{ flex: 1 }} hintText="What's in your mind about?"
					ref="field" id="field"
					onKeyDown={this.onKeyDown}
				/>
				<IconButton style={{ flex: 0 }} iconStyle={{ color: '#999' }}
					onClick={this.submit}
					iconClassName="material-icons">add_circle</IconButton>
			</div>
		);
	}
	onKeyDown(event) {
		if (event.keyCode === 13) {
			this.submit();
		}
	}
	submit() {
		const element = findDOMNode(this.refs.field).getElementsByTagName('textarea')[0];
		debug('Submit', element.value);
		this.refs.field.blur();
		this.sendMessage(EventTypes.Submit, element.value);
		element.value = '';
	}
}
