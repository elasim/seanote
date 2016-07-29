import flow from 'lodash/flow';
import { deferrable, comparable, selectable, issuedAt } from './decorators';

export const deferredSelectFirst = flow(
	deferrable(),
	comparable(makeComparable('url', 'method')),
	selectable(selectFirst),
	issuedAt(),
);

export const deferredSelectLast = flow(
	deferrable(),
	comparable(makeComparable('url', 'method')),
	selectable(selectLast),
	issuedAt()
);

function makeComparable(...props) {
	return (obj) => {
		const acc = {};
		for (const key of props) {
			acc[key] = obj[key];
		}
		return JSON.stringify(acc);
	};
}

function selectFirst(lhs, rhs) {
	return (lhs.timestamp < rhs.timestamp) ? lhs : rhs;
}

function selectLast(lhs, rhs) {
	return (lhs.timestamp >= rhs.timestamp) ? lhs : rhs;
}
