import createModel from './lib/model';

export default createModel({
	base: '/api/card',
	methods: {
		renumber() {
			return {
				path: '/api/card/_renumber',
				method: 'post',
			};
		},
	},
});
