import React, { Component, PropTypes } from 'react';
import { intlShape } from 'react-intl';

export default class Messages extends Component {
	static contextTypes = {
		intl: intlShape.isRequired,
	};
	render() {
		return (
			<div>Messages</div>
		);
	}
}
