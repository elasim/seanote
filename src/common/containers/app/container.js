import Rx from 'rx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import browserHistory from 'react-router/lib/browserHistory';
import flow from 'lodash/flow';
import AppAction from '../../actions/app';
import { prefetch } from '../../actions/prefetch';
import withContext from '../with-context';
import App from './components/app';

class AppContainer extends Component {
	componentDidMount() {
		this.getTokenInterval = Rx.Observable.interval(1000 * 60)
			.subscribe(() => this.props.getToken());
		this.props.prefetch();
	}
	componentWillReceiveProps(nextProps) {
		if (!nextProps.token) {
			browserHistory.push('/signin');
		}
	}
	componentWillUnmount() {
		if (this.getTokenInterval) {
			this.getTokenInterval.dispose();
		}
	}
	render() {
		return (
			<App {...this.props} />
		);
	}
}

export default flow(
	connect(
		state => ({
			headerVisibility: state.app.headerVisibility,
			dim: state.app.dim,
			token: state.app.token,
		}),
		{
			setHeaderVisibility: AppAction.setHeaderVisibility,
			setDim: AppAction.setDim,
			getToken: AppAction.getToken,
			prefetch,
		}
	),
	withContext
)(AppContainer);
