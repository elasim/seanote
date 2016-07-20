import Rx from 'rx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import flow from 'lodash/flow';
import AppAction from '../../actions/app';
import AuthAction from '../../actions/auth';
import DataAction from '../../actions/data';
import withContext from '../with-context';
import App from './components/app';

class AppContainer extends Component {
	componentDidMount() {
		this.tokenRefresher = this::createTokenRefresher();
		this.props.prefetch();
	}
	componentWillUnmount() {
		if (this.tokenRefresher) {
			this.tokenRefresher.dispose();
		}
	}
	render() {
		return (
			<App {...this.props} />
		);
	}
}

// calling whoami api every minutes
// to maintain current user session without request
function createTokenRefresher() {
	return Rx.Observable.interval(1000 * 60)
		.subscribe(() => this.props.acquireToken());
}

export default flow(
	connect(
		state => ({
			headerVisibility: state.app.headerVisibility,
			dim: state.app.dim,
		}),
		{
			setHeaderVisibility: AppAction.setHeaderVisibility,
			setDim: AppAction.setDim,
			acquireToken: AuthAction.acquireToken,
			prefetch: DataAction.prefetch,
		}
	),
	withContext
)(AppContainer);
