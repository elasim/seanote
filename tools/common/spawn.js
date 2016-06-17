import cp from 'child_process';

export default function spawn(name, path, arg = [], opt) {
	const out = stdout.bind(null, name);
	const err = stderr.bind(null, name);

	out(`execute: ${path} ${arg.join(' ')}\n`);
	const handle = cp.spawn('node', [].concat(path, arg), opt);

	handle.stdout.on('data', out);
	handle.stderr.on('data', err);
	handle.on('exit', code => out(`exited with code ${code}\n`));

	return handle;
}

function stdout(tag, data) {
	return log(process.stdout, tag, data);
}
function stderr(tag, data) {
	return log(process.stderr, tag, data);
}
function log(fd, tag, data) {
	const text = data
		.toString('utf8')
		.replace(/^(.)/gm, `[${time()}][${tag}] $1`);
	fd.write(text);
}
function time() {
	const now = new Date();
	return now.toLocaleString();
}
