import createModel from './lib/model';

export default createModel({
	base: '/api/user',
	methods: {
		getToken() {
			return {
				url: '/auth/token',
				method: 'get',
			};
		},
	},
});
