import { Router } from 'express';
import bodyParser from 'body-parser';

import Event from './event';
import User from './user';
// import Board from './board';

const router = new Router();
router.use(bodyParser.json());

// router.use('/board', Board);
router.use('/event', Event);
router.use('/user', User);
router.use((error, req, res, next) => {
	res.status(500).json({ error: error.message });
});
router.use((req, res) => {
	res.status(404).json({ error: 'invalid request'});
});

export default router;
