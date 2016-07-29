import { Router } from 'express';
import bodyParser from 'body-parser';
import { requireAuth, cacheControl } from './middlewares';

const router = new Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cacheControl('no-cache'));
router.use(requireAuth);

export default router;
