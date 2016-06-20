
const initialState = {
	title: undefined,
	contextMenu: undefined,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case 'setTitle':
			return {
				...state,
				title: action.payload
			};
		case 'setContextMenu':
			return {
				...state,
				contextMenu: action.payload
			};
	}
	return state;
}
