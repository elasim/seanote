import { prefetch, ActionTypes as PrefetchActions } from './data/prefetch';
import { request, ActionTypes as RequestActions } from './data/request';

export default {
	request,
	prefetch,
};
export const ActionTypes = {
	...PrefetchActions,
	...RequestActions,
};
export {
	request,
	prefetch
};
