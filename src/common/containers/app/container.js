import flow from 'lodash/flow';
import { connect } from 'react-redux';
import AppAction from '../../actions/app';
import AuthAction from '../../actions/auth';
import DataAction from '../../actions/data';
import withContext from '../with-context';
import App from './app';

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
)(App);
