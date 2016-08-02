import execute, { bulkExecute } from '../data/execute';

export const ActionTypes = {
	beginRequest: 'DATA_BEGIN_REQUEST',
	endRequest: 'DATA_END_REQUESET',
};

export function request(dispatch, dataRequest) {
	return run(dispatch, execute.bind(null, dataRequest));
}

export function bulkRequest(dispatch, dataRequests) {
	return run(dispatch, bulkExecute.bind(null, dataRequests));
}

function run(dispatch, command, data) {
	dispatch(beginRequest());
	return command()
		.then(result => {
			dispatch(endRequest(null));
			return result;
		})
		.catch(e => dispatch(endRequest(e)));
}

function beginRequest() {
	return {
		type: ActionTypes.beginRequest,
	};
}

function endRequest() {
	return {
		type: ActionTypes.endRequest,
	};
}
