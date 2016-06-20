import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

@connect((state) => ({ locale: state.locale }))
export default class LocaleSelector extends Component {
	render() {
		return (
			<IntlProvider {...this.props} />
		);
	}
}
