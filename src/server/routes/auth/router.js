import { Router } from 'express';
import bodyParser from 'body-parser';
// import { User, UserLogin, UserProfile, } from '../../data';

const $r = new Router();

$r.use((req, res, next) => {
	console.log(req.headers.accept);
	if (req.headers['accept'] === 'application/json') {
		req.callingAPI = true;
	}
	next();
});
$r.use(bodyParser.json());
$r.put('/', (req, res) => {
	console.log(req.body);

	res.status(403).end();
});

export default $r;
