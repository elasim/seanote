import HttpError from '../utils/http-error';

export default {
	async get(req) {
		return {
			error: 'Not Implemented',
		};
		//throw new HttpError('Not Implemented', 500);
	}
};
