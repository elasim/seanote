import _ from 'lodash';
import { connect } from 'react-redux';
import App from './app';
import AppContext from '../app-context';

const decorators = _.flow(
	connect(state => ({ ...state.app, authError: state.auth.error, })),
	AppContext
);

export default decorators(App);
