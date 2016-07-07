import _ from 'lodash';
import { connect } from 'react-redux';
import withContext from '../with-context';
import App from './app';

export default _.flow(
	connect(null, null),
	withContext
)(App);
