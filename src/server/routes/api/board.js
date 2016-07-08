import { requireAuth } from './middlewares';
import { User, Board } from '../../data';

export default {
	get: [requireAuth, async (req) => {
		return Promise.reject({
			'error': 'not implemented'
		});
	}],
	/*
	put(req, res) {

	},
	post(req, res) {

	},
	delete(req, res) {

	},
	*/
};
