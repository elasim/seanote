import { Router } from 'express';
import bodyParser from 'body-parser';
import { auth, cacheControl } from './middlewares';

const router = new Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cacheControl('no-cache'));
router.use(auth);

export default router;
