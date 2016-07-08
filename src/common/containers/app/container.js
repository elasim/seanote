import _ from 'lodash';
import { connect } from 'react-redux';
import withContext from '../with-context';
import App from './app';
import AuthAction from '../../actions/auth';

export default _.flow(
	connect(
		null,
		{
			acquireToken: AuthAction.acquireToken
		}
	),
	withContext
)(App);
