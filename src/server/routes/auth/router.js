import { Router } from 'express';
import bodyParser from 'body-parser';
// import { User, UserLogin, UserProfile, } from '../../data';

const router = new Router();

router.use((req, res, next) => {
	if (req.headers['accept'] === 'application/json') {
		req.callingAPI = true;
	}
	next();
});
router.use(bodyParser.json());
router.put('/', (req, res) => {
	res.status(403).end();
});

export default router;
