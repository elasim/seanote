import router from './router';
import './auth-local';
import './auth-fb';
import './auth-google';

router.use((error, req, res, next) => {
	next(error);
});

export default router;
