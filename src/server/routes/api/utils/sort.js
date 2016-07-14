
export function sortLinkedList(rows, key = 'id', before = 'BeforeId') {
	let i;
	let row;
	let lastKey;
	const ordered = [];
	const map = {};
	for (i = 0, row = rows[i]; i < rows.length; row = rows[++i]) {
		if (row[before] === null) {
			ordered.push(row);
		} else {
			map[row[before]] = i;
		}
	}
	lastKey = ordered[0][key];
	while (ordered.length < rows.length) {
		const current = rows[map[lastKey]];
		ordered.push(current);
		lastKey = current.id;
	}
	return ordered;
}
