import './auth-fb';
import './auth-google';
import './auth-local';
import router from './router';

router.use((error, req, res, next) => {
	if (req.callingAPI) {
		res.status(500).json({
			error: error.message
		});
	} else {
		next(error);
	}
});

export default router;
