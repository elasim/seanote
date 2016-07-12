import _ from 'lodash';
import { connect } from 'react-redux';
import withContext from '../with-context';
import App from './app';
import AppAction from '../../actions/app';
import AuthAction from '../../actions/auth';
import DataAction from '../../actions/data';

export default _.flow(
	connect(
		state => ({
			headerVisibility: state.app.headerVisibility,
		}),
		{
			setHeaderVisibility: AppAction.setHeaderVisibility,
			acquireToken: AuthAction.acquireToken,
			prefetch: DataAction.prefetch,
		}
	),
	withContext
)(App);
