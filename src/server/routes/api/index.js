import { Router } from 'express';
import bodyParser from 'body-parser';

import APIDescriptors from './descriptors';
import configureRoutes from './configure-routes';
import { cacheControl, catchError, notFound } from './middlewares';

import StreamHandler from './utils/stream';
import BulkHandler from './utils/bulk';

const router = new Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cacheControl('no-cache'));

configureRoutes(router, APIDescriptors);

router.get('/_stream', StreamHandler);
router.post('/_bulk', BulkHandler);

router.use(catchError(500, 'internal server error'));
router.use(notFound('invalid request'));

export default router;
