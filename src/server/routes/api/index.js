import router from './router';
import edges from './edges';
import configureRoutes from './configure-routes';
import { catchError, notFound } from './middlewares';

import StreamHandler from './utils/stream';
import BulkHandler from './utils/bulk';

configureRoutes(router, edges);

router.get('/_stream', StreamHandler);
router.post('/_bulk', BulkHandler);

router.use(catchError(500, 'internal server error'));
router.use(notFound('invalid request'));

export default router;
