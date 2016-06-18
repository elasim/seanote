import fs from 'fs';
import path from 'path';

const fileCache = [];
const replacer = /\$\{([^}]+)\}/;

// This is very simple template engine to replace text
export function engine(filePath, options, callback) {
	getFileContent(filePath)
		.then(body => {
			let text = body.toString('utf8');
			let match;
			while ((match = text.match(replacer)) != null) {
				text = text.substr(0, match.index)
						+ options[match[1]]
						+ text.substr(match.index + match[0].length);
			}
			callback(null, text);
		})
		.catch(callback);
}

function getFileContent(filePath) {
	if (fileCache[filePath]) {
		return Promise.resolve(fileCache[filePath]);
	}
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, (e, buffer) => {
			if (e) {
				return reject(e);
			}
			fileCache[filePath] = buffer;
			resolve(buffer);
		});
	});
}
