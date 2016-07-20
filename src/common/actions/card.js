import { getCards } from '../data/card';
import execute from '../data/execute';

export default {
	sort,
};

export const ActionTypes = {
	sort: 'CARD_SORT',
};

export function sort(list, a, b) {
	return async (dispatch, getState) => {
		const { renumbering } = getState().card[list];
		if (renumbering) {
			// await execute(renumber());
			load(list);
		}
		dispatch({
			type: ActionTypes.sort,
			payload: { list, a, b },
		});
	};
}

function load() {

}
