import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import AppActions from '../actions/app';

export default (Container) => {
	class ComposedContainer extends Component {
		static childContextTypes = {
			getTitle: PropTypes.func,
			setTitle: PropTypes.func,
			setLocale: PropTypes.func,
			setContextMenu: PropTypes.func,
		}
		constructor(props, context) {
			super(props, context);
			this.appContext = {
				...context,
				getTitle() {
					return props.title;
				},
				setTitle(title) {
					if (typeof document !== 'undefined') {
						document.title = title;
					}
					props.setTitle(title);
				},
				setContextMenu(contextMenu) {
					props.setContextMenu(contextMenu);
				},
				setLocale(locale) {
					props.setLocale(locale);
				},
			};
		}
		getChildContext() {
			return this.appContext;
		}
		componentWillReceiveProps(nextProps) {
			if (this.props.title !== nextProps.title) {
				document.title = nextProps.title;
			}
		}
		render() {
			return (
				<IntlProvider locale={this.props.locale}>
					<Container {...this.props}/>
				</IntlProvider>
			);
		}
	}
	return connect(
		state => ({
			title: state.app.title,
			locale: state.app.locale
		}),
		{ ...AppActions },
	)(ComposedContainer);
};
