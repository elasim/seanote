import { handleActions } from 'redux-actions';

const initialStates = {
	/**
	 * Prefetched or Cached Room metadata (partials)
	 * It should have to contain roomId, and participants.
	 * [ { id, name, participants, lastMessage, unreads, ... } ]
	 */
	rooms: [],
	/**
	 * rooms field contain cached data only.
	 * rest of data will be loaded after user requests.
	 * In the while, Use this value to get unread message counts.
	 */
	numberOfUnreads: 0,
	/**
	 * 	it contains actuall streamed messages.
	 * To fill this data, Dispatch Message.getTexts() action
	 * { ...[roomId]: Array }
	 */
	texts: {}
};

export default handleActions({

}, initialStates);
