//const initialState = navigator.language||'en';

export default function (state = null, action) {
	if (action.type === 'changeLocale') {
		state = action.payload;
	}
	return state;
}
