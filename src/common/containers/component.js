import { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';

export default class UIComponent extends Component {
	static propTypes = {
		onMessage: PropTypes.func,
	};
	static defaultProps = {
		onMessage: emptyFunction
	};
	constructor(...args) {
		super(...args);
	}
	sendMessage(msg, args) {
		this.props.onMessage(msg, args);
	}
}
